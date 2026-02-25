"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MessageRenderer } from "./MessageRenderer";
import { UIMessage } from "ai";
import { GoogleCalendarEvent } from "@/types/google/calendar";
import { formatDistanceToNow } from "date-fns";

// ─── Tenex Logo SVG ────────────────────────────────────────────────────────
export function TenexLogo({ className }: { className?: string }) {
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

interface ChatMessagesListProps {
    messages: UIMessage[];
    isStreaming: boolean;
    userInitials: string;
    userPhotoUrl?: string;
    events: GoogleCalendarEvent[];
    onEventClick: (event: GoogleCalendarEvent) => void;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatMessagesList({
    messages,
    isStreaming,
    userInitials,
    userPhotoUrl,
    events,
    onEventClick,
    messagesEndRef,
}: ChatMessagesListProps) {
    const getMessageText = (msg: any): string => {
        if (msg.parts) {
            return msg.parts
                .filter((part: any) => part.type === "text")
                .map((part: any) => part.text)
                .join("");
        }
        return msg.content || "";
    };

    return (
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
                                        <AvatarImage src={userPhotoUrl || ""} />
                                        <AvatarFallback className="bg-accent font-bold">{userInitials}</AvatarFallback>
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
                                            onEventClick={onEventClick}
                                        />
                                    ) : (
                                        getMessageText(msg)
                                    )}
                                </div>
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-1 opacity-60">
                                    {(msg as any).createdAt ? formatDistanceToNow(new Date((msg as any).createdAt), { addSuffix: true }) : "Just now"}
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
    );
}
