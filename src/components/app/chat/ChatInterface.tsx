"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChatMessagesList } from "./ChatMessagesList";
import { ChatInputForm } from "./ChatInputForm";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCalendar } from "@/hooks/use-calendar";
import { useChat } from "@ai-sdk/react";
import { UIMessage } from "ai";
import { EventDetailModal } from "../navigation/EventDetailModal";
import { ReschedulePickerModal } from "./ReschedulePickerModal";
import { GoogleCalendarEvent } from "@/types/google/calendar";
import { QuickAction } from "./quick-actions";
import { ConversationService } from "@/lib/services/firebase/conversations";
import { ActivityService, ActivityType } from "@/lib/services/firebase/activity";
import { useChatSession } from "@/hooks/use-chat-session";

// ─── Component ────────────────────────────────────────────────────────────────

export function ChatInterface() {
    const { user } = useAuth();
    const { events, refetch } = useCalendar();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const initials = user?.displayName
        ? user.displayName.split(" ").map(n => n[0]).join("").toUpperCase()
        : user?.email?.substring(0, 2).toUpperCase() || "U";

    const [input, setInput] = useState("");
    const [selectedEvent, setSelectedEvent] = useState<GoogleCalendarEvent | null>(null);
    const [reschedulePickerOpen, setReschedulePickerOpen] = useState(false);
    const { activeConversationId, refreshHistory, conversations, loadingHistory } = useChatSession();
    const loggedToolCallsRef = useRef<Set<string>>(new Set());

    const { messages, sendMessage, setMessages, status } = useChat({
        id: activeConversationId,
    });

    const isStreaming = status === "streaming" || status === "submitted";

    // ─── Fetch Conversation History ───────────────────────────────────────────
    useEffect(() => {
        if (!user?.uid || !activeConversationId) return;

        let active = true;

        const loadMessages = async () => {
            try {
                const msgs = await ConversationService.getMessages(user.uid, activeConversationId);
                if (!active) return;

                if (msgs.length > 0) {
                    // Convert Firestore format to AI SDK Message format
                    const formattedMsgs = msgs.map((m: any) => ({
                        id: m.id,
                        role: m.role,
                        content: m.content,
                        createdAt: m.createdAt?.toDate ? m.createdAt.toDate() : m.createdAt,
                        parts: [{ type: "text", text: m.content }]
                    }));
                    setMessages(formattedMsgs as UIMessage[]);
                }
            } catch (err) {
                console.error("Failed to load conversation messages:", err);
            }
        };

        loadMessages();

        return () => { active = false; };
    }, [activeConversationId, user?.uid, setMessages]);

    // ─── Initial Greeting ─────────────────────────────────────────────────────
    useEffect(() => {
        // Wait until history is fully loaded so we don't accidentally overwrite an old thread
        if (loadingHistory) return;

        // Check if the current ID is brand new (not in the list of past conversations)
        const isNewChat = !conversations.some(c => c.id === activeConversationId);

        // Only show greeting if there are no messages and it genuinely is a new conversation
        if (messages.length === 0 && isNewChat) {
            const hour = new Date().getHours();
            const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
            setMessages([{
                id: "welcome",
                role: "assistant",
                content: `${greeting}, ${user?.displayName?.split(" ")[0] || "there"}. I'm connected to your calendar and ready. Use the quick actions below or ask me anything.`,
                parts: [{
                    type: "text",
                    text: `${greeting}, ${user?.displayName?.split(" ")[0] || "there"}. I'm connected to your calendar and ready. Use the quick actions below or ask me anything.`,
                }],
            } as UIMessage]);
        }
    }, [messages.length, activeConversationId, conversations, loadingHistory, setMessages, user]);

    // ─── Auto-scroll to bottom on new messages ────────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ─── Refetch calendar when AI creates or deletes an event ──────────────────
    useEffect(() => {
        if (isStreaming) return;
        const mutationTools = ["tool-create_event", "tool-delete_event"];
        const doneStates = ["output-available", "result"];
        const hasCalendarMutation = messages.some((msg: any) =>
            msg.role === "assistant" &&
            msg.parts?.some((part: any) => {
                // AI SDK v6 format
                if (mutationTools.includes(part.type) && doneStates.includes(part.state)) return true;
                // Legacy format
                if (part.type === "tool-invocation") {
                    const inv = part.toolInvocation || part;
                    if (["create_event", "delete_event"].includes(inv.toolName) && doneStates.includes(inv.state)) return true;
                }
                return false;
            })
        );
        if (hasCalendarMutation) refetch();
    }, [isStreaming, messages, refetch]);

    // ─── Persist conversation to Firestore ──────────────────────────────────
    const lastPersistedHashRef = useRef<string>("");

    useEffect(() => {
        if (isStreaming || !user?.uid || messages.length < 2) return;

        // Skip saving if the only message is the welcome greeting
        if (messages.length === 1 && messages[0].id === "welcome") return;

        const serialized = messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            createdAt: msg.createdAt,
            content: msg.parts
                ?.filter((p: any) => p.type === "text")
                .map((p: any) => p.text)
                .join("") || msg.content || "", // Fallback to raw content if no parts
        }));

        const hash = JSON.stringify(serialized.map(s => ({ id: s.id, content: s.content })));
        if (hash === lastPersistedHashRef.current) return;
        lastPersistedHashRef.current = hash;

        // Use the first user message as the title
        const title = serialized.find((m: any) => m.role === "user")?.content?.slice(0, 60) || "Chat";

        ConversationService.saveConversation(
            user.uid, activeConversationId, title, serialized
        )
            .then(() => {
                // Refresh the sidebar history so the user sees their new chat name immediately
                refreshHistory();
            })
            .catch((err) => console.error("Failed to persist conversation:", err));
    }, [isStreaming, messages, user?.uid, activeConversationId, refreshHistory]);

    // ─── Log agent actions to Firestore ──────────────────────────────────────
    useEffect(() => {
        if (isStreaming || !user?.uid) return;

        const TOOL_TO_ACTIVITY: Record<string, ActivityType> = {
            create_event: "event_created",
            delete_event: "event_deleted",
            get_events: "calendar_fetch",
        };

        // Helper to extract tool info from a part (supports both SDK formats)
        const getToolFromPart = (part: any): { name: string; output: any; partId: string } | null => {
            const doneStates = ["output-available", "result"];
            // AI SDK v6: part.type = "tool-{name}"
            if (typeof part.type === "string" && part.type.startsWith("tool-") && doneStates.includes(part.state)) {
                const name = part.type.replace("tool-", "");
                return { name, output: part.output || part.result, partId: `${part.type}-${part.toolCallId || part.id || ""}` };
            }
            // Legacy: part.type = "tool-invocation"
            if (part.type === "tool-invocation") {
                const inv = part.toolInvocation || part;
                if (doneStates.includes(inv.state)) {
                    return { name: inv.toolName, output: inv.result || inv.output, partId: `${inv.toolName}-${inv.toolCallId || ""}` };
                }
            }
            return null;
        };

        for (const msg of messages) {
            if (msg.role !== "assistant" || !msg.parts) continue;
            for (const part of msg.parts as any[]) {
                const tool = getToolFromPart(part);
                if (!tool) continue;
                if (loggedToolCallsRef.current.has(tool.partId)) continue;
                loggedToolCallsRef.current.add(tool.partId);

                const activityType = TOOL_TO_ACTIVITY[tool.name];
                if (!activityType) continue;

                const summary = tool.name === "create_event"
                    ? `Created event: ${tool.output?.event?.summary || "Unknown"}`
                    : tool.name === "delete_event"
                        ? `Deleted event: ${tool.output?.message || "Unknown"}`
                        : `Fetched ${tool.output?.count ?? 0} events`;

                ActivityService.log(user.uid, activityType, summary, {
                    toolName: tool.name,
                    output: tool.output,
                });
            }
        }
    }, [isStreaming, messages, user?.uid]);

    // ─── Auto-resize textarea based on content ────────────────────────────────
    useEffect(() => {
        const el = document.getElementById("chat-input");
        if (el) {
            el.style.height = "auto";
            el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
        }
    }, [input]);

    // ─── Handlers ─────────────────────────────────────────────────────────────
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isStreaming) return;
        sendMessage({ text: input });
        setInput("");
    };

    const handleQuickAction = (action: QuickAction) => {
        if (isStreaming) return;
        if (action.label === "Reschedule sync") {
            setReschedulePickerOpen(true);
            return;
        }
        setInput(action.buildPrompt(events));
        document.getElementById("chat-input")?.focus();
    };

    const handleRescheduleSelect = (event: GoogleCalendarEvent) => {
        setReschedulePickerOpen(false);
        const time = event.start?.dateTime
            ? new Date(event.start.dateTime).toLocaleString("en-US", { weekday: "long", hour: "numeric", minute: "2-digit" })
            : "soon";
        const prompt = `Reschedule "${event.summary}" currently at ${time}. Delete the old event from my calendar and create a new one at the next available slot.`;
        sendMessage({ text: prompt });
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col h-full w-full">
            <ChatMessagesList
                messages={messages}
                isStreaming={isStreaming}
                userInitials={initials}
                userPhotoUrl={user?.photoURL || undefined}
                events={events}
                onEventClick={setSelectedEvent}
                messagesEndRef={messagesEndRef}
            />

            <div className="shrink-0 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent">
                <div className="max-w-3xl mx-auto w-full">
                    <ChatInputForm
                        input={input}
                        isStreaming={isStreaming}
                        onInputChange={handleInputChange}
                        onSubmit={handleSubmit}
                        onQuickAction={handleQuickAction}
                    />
                </div>
            </div>

            {/* Event Detail Modal for Citations */}
            <EventDetailModal
                isOpen={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
                event={selectedEvent}
            />

            {/* Reschedule Picker Modal */}
            <ReschedulePickerModal
                isOpen={reschedulePickerOpen}
                events={events}
                onSelect={handleRescheduleSelect}
                onClose={() => setReschedulePickerOpen(false)}
            />
        </div>
    );
}
