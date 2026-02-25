"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCalendar } from "@/hooks/use-calendar";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageRenderer } from "./MessageRenderer";
import { EventDetailModal } from "../navigation/EventDetailModal";
import { ReschedulePickerModal } from "./ReschedulePickerModal";
import { GoogleCalendarEvent } from "@/types/google/calendar";
import { QUICK_ACTIONS, QuickAction } from "./quick-actions";
import { ConversationService } from "@/lib/services/firebase/conversations";
import { ActivityService, ActivityType } from "@/lib/services/firebase/activity";

// ─── Tenex Logo SVG (shared between avatar instances) ─────────────────────────

function TenexLogo({ className }: { className?: string }) {
    return (
        <svg width="24" height="24" viewBox="0 0 60 43" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <rect y="0.000183105" width="60" height="42.6168" fill="#FFE501" rx="4" />
            <rect x="16.3604" y="7.48938" width="27.3999" height="8.27911" transform="rotate(90 16.3604 7.48938)" fill="black" />
            <path d="M51.9209 16.5607L51.9209 7.71429L42.788 7.71429L42.788 16.5607L51.9209 16.5607Z" fill="black" />
            <path d="M42.79 25.4065L42.79 16.5601L33.6572 16.5601L33.6572 25.4065L42.79 25.4065Z" fill="black" />
            <path d="M51.9209 34.2547L51.9209 25.4083L42.788 25.4083L42.788 34.2547L51.9209 34.2547Z" fill="black" />
            <path d="M33.6562 16.5607L33.6562 7.71429L24.5234 7.71429L24.5234 16.5607L33.6562 16.5607Z" fill="black" />
            <path d="M33.6562 34.2546L33.6562 25.4082L24.5234 25.4082L24.5234 34.2546L33.6562 34.2546Z" fill="black" />
        </svg>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChatInterface() {
    const { user } = useAuth();
    const { events, refetch } = useCalendar();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const initials = user?.displayName
        ? user.displayName.split(" ").map(n => n[0]).join("").toUpperCase()
        : user?.email?.substring(0, 2).toUpperCase() || "U";

    const [input, setInput] = useState("");
    const [firingAction, setFiringAction] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<GoogleCalendarEvent | null>(null);
    const [reschedulePickerOpen, setReschedulePickerOpen] = useState(false);
    const conversationIdRef = useRef(`conv-${Date.now()}`);
    const loggedToolCallsRef = useRef<Set<string>>(new Set());;

    // Transport sends the Google access token as a header so the server-side
    // tool can call the Google Calendar API on behalf of the user.
    const transportRef = useRef(
        new DefaultChatTransport({
            api: "/api/chat",
            prepareSendMessagesRequest: ({ messages: msgs, body }) => {
                const token = typeof window !== "undefined"
                    ? localStorage.getItem("google_access_token")
                    : null;
                return {
                    body: { ...(body ?? {}), messages: msgs },
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                };
            },
        })
    );

    const { messages, sendMessage, setMessages, status } = useChat({
        transport: transportRef.current,
    });

    const isStreaming = status === "streaming" || status === "submitted";

    // ─── Initial Greeting ─────────────────────────────────────────────────────
    useEffect(() => {
        if (messages.length === 0) {
            const hour = new Date().getHours();
            const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
            setMessages([{
                id: "welcome",
                role: "assistant",
                parts: [{
                    type: "text",
                    text: `${greeting}, ${user?.displayName?.split(" ")[0] || "there"}. I'm connected to your calendar and ready. Use the quick actions below or ask me anything.`,
                }],
            }]);
        }
    }, [messages.length, setMessages, user]);

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
    useEffect(() => {
        if (isStreaming || !user?.uid || messages.length < 2) return;
        const serialized = messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.parts
                ?.filter((p: any) => p.type === "text")
                .map((p: any) => p.text)
                .join("") || "",
        }));
        const title = serialized.find((m: any) => m.role === "user")?.content?.slice(0, 60) || "Chat";
        ConversationService.saveConversation(
            user.uid, conversationIdRef.current, title, serialized
        ).catch((err) => console.error("Failed to persist conversation:", err));
    }, [isStreaming, messages, user?.uid]);

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

    const getMessageText = (msg: any): string => {
        if (msg.parts) {
            return msg.parts
                .filter((part: any) => part.type === "text")
                .map((part: any) => part.text)
                .join("");
        }
        return msg.content || "";
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col h-full w-full">

            {/* Messages scrollable area */}
            <div className="flex-1 overflow-y-auto overscroll-none px-6 pt-8 scrollbar-none">
                <div className="max-w-3xl mx-auto w-full space-y-8 pb-6">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500",
                                msg.role === "user" ? "items-end" : "items-start"
                            )}
                        >
                            <div className={cn(
                                "flex gap-4 max-w-[90%]",
                                msg.role === "user" ? "flex-row-reverse" : "flex-row"
                            )}>
                                {/* Avatar */}
                                <Avatar className={cn(
                                    "h-9 w-9 border shadow-sm shrink-0 items-center justify-center overflow-hidden",
                                    msg.role === "assistant" ? "bg-[#FFE501] border-primary/20" : "border-background"
                                )}>
                                    {msg.role === "assistant" ? (
                                        <TenexLogo className="w-6 h-auto" />
                                    ) : (
                                        <>
                                            <AvatarImage src={user?.photoURL || ""} />
                                            <AvatarFallback className="bg-accent font-bold">{initials}</AvatarFallback>
                                        </>
                                    )}
                                </Avatar>

                                {/* Message bubble */}
                                <div className="space-y-2 max-w-full overflow-hidden">
                                    <div className={cn(
                                        "px-4 py-3 rounded-2xl text-sm font-medium shadow-sm leading-relaxed",
                                        msg.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                            : "bg-background border rounded-tl-none text-foreground break-words max-w-full"
                                    )}>
                                        {msg.role === "assistant" ? (
                                            <MessageRenderer
                                                msg={msg}
                                                events={events}
                                                onEventClick={setSelectedEvent}
                                                onEventCreated={refetch}
                                            />
                                        ) : (
                                            getMessageText(msg)
                                        )}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-1 opacity-60">
                                        Just now
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isStreaming && (
                        <div className="flex items-start gap-4 animate-in fade-in duration-300">
                            <Avatar className="h-9 w-9 border shadow-sm shrink-0 bg-[#FFE501] border-primary/20 items-center justify-center overflow-hidden">
                                <TenexLogo className="w-6 h-auto" />
                            </Avatar>
                            <div className="bg-background border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                                <div className="flex gap-1 items-center h-4">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input bar — pinned to bottom */}
            <div className="shrink-0 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent">
                <div className="max-w-3xl mx-auto w-full">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full bg-background border border-border/60 rounded-2xl shadow-xl p-2 flex flex-col gap-1 transition-all focus-within:border-primary/30 focus-within:shadow-2xl focus-within:shadow-primary/5"
                    >
                        <div className="flex items-center gap-2 px-3">
                            <textarea
                                id="chat-input"
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e as any);
                                    }
                                }}
                                placeholder="Ask Tenex Intelligence anything..."
                                className="flex-1 border-none shadow-none focus-visible:outline-none bg-transparent font-medium min-h-[44px] max-h-[200px] resize-none py-3 px-0 m-0"
                                disabled={isStreaming}
                                rows={1}
                            />
                            <div className="flex h-11 items-center mb-0.5">
                                <Button
                                    type="submit"
                                    disabled={!input?.trim() || isStreaming}
                                    className="h-9 w-9 p-0 rounded-xl bg-primary shadow-md shadow-primary/20 hover:scale-105 transition-all disabled:opacity-30 disabled:scale-100 shrink-0"
                                >
                                    {isStreaming ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <ArrowUp className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Quick Action Chips */}
                        <div className="flex items-center justify-between px-2 pb-0.5">
                            <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1">
                                {QUICK_ACTIONS.map((action) => {
                                    const Icon = action.icon;
                                    const isFiring = firingAction === action.label;
                                    return (
                                        <button
                                            key={action.label}
                                            type="button"
                                            disabled={isStreaming}
                                            onClick={() => handleQuickAction(action)}
                                            className={cn(
                                                "flex items-center gap-1.5 text-[10px] whitespace-nowrap px-2.5 py-1.5 rounded-full transition-all font-bold text-muted-foreground border border-transparent",
                                                "bg-accent/50 disabled:opacity-40 disabled:cursor-not-allowed",
                                                !isStreaming && action.color
                                            )}
                                        >
                                            {isFiring ? (
                                                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                                            ) : (
                                                <Icon className="h-2.5 w-2.5" />
                                            )}
                                            {action.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="hidden sm:block text-[9px] text-muted-foreground font-bold tracking-widest uppercase opacity-40 shrink-0 pl-2">
                                Tenex AI v1.0
                            </p>
                        </div>
                    </form>
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
