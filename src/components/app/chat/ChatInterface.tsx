"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Send,
    Mic,
    Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { StatsGrid } from "@/components/app/chat/StatsGrid";
import { ScheduleCard } from "@/components/app/chat/ScheduleCard";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    type?: "stats" | "schedule" | "text";
    timestamp: Date;
}

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Initial AI sequence
        const initialMessages: Message[] = [
            {
                id: "1",
                role: "assistant",
                content: "Good evening, Jawad. I've updated your workspace with your latest calendar context in the sidebar. How can I assist you with your schedule today?",
                timestamp: new Date(),
            }
        ];

        setMessages(initialMessages);
    }, []);

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        // Simulate AI thinking
        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I've processed that request. I'm checking your GSuite permissions to finalize the changes.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMsg]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full relative w-full group">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-6 pb-48 space-y-8 scrollbar-none pt-8">
                <div className="max-w-3xl mx-auto w-full space-y-8">
                    {messages.map((msg, idx) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500",
                                msg.role === "user" ? "items-end" : "items-start"
                            )}
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className={cn(
                                "flex gap-4 max-w-[90%]",
                                msg.role === "user" ? "flex-row-reverse" : "flex-row"
                            )}>
                                <Avatar className={cn(
                                    "h-9 w-9 border shadow-sm shrink-0 items-center justify-center overflow-hidden",
                                    msg.role === "assistant" ? "bg-[#FFE501] border-primary/20" : "border-background"
                                )}>
                                    {msg.role === "assistant" ? (
                                        <svg width="24" height="24" viewBox="0 0 60 43" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-auto">
                                            <rect y="0.000183105" width="60" height="42.6168" fill="#FFE501" rx="4" />
                                            <rect x="16.3604" y="7.48938" width="27.3999" height="8.27911" transform="rotate(90 16.3604 7.48938)" fill="black" />
                                            <path d="M51.9209 16.5607L51.9209 7.71429L42.788 7.71429L42.788 16.5607L51.9209 16.5607Z" fill="black" />
                                            <path d="M42.79 25.4065L42.79 16.5601L33.6572 16.5601L33.6572 25.4065L42.79 25.4065Z" fill="black" />
                                            <path d="M51.9209 34.2547L51.9209 25.4083L42.788 25.4083L42.788 34.2547L51.9209 34.2547Z" fill="black" />
                                            <path d="M33.6562 16.5607L33.6562 7.71429L24.5234 7.71429L24.5234 16.5607L33.6562 16.5607Z" fill="black" />
                                            <path d="M33.6562 34.2546L33.6562 25.4082L24.5234 25.4082L24.5234 34.2546L33.6562 34.2546Z" fill="black" />
                                        </svg>
                                    ) : (
                                        <>
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback className="bg-accent font-bold">JS</AvatarFallback>
                                        </>
                                    )}
                                </Avatar>

                                <div className="space-y-2">
                                    {msg.type === "text" || !msg.type ? (
                                        <div className={cn(
                                            "px-4 py-3 rounded-2xl text-sm font-medium shadow-sm leading-relaxed",
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-background border rounded-tl-none text-foreground"
                                        )}>
                                            {msg.content}
                                        </div>
                                    ) : msg.type === "stats" ? (
                                        <StatsGrid />
                                    ) : (
                                        <ScheduleCard />
                                    )}
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-1 opacity-60">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Sticky Bottom Input Area */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/95 to-transparent pt-12">
                <div className="max-w-3xl mx-auto w-full">
                    <form
                        onSubmit={handleSend}
                        className="w-full bg-background/80 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl p-2 flex flex-col gap-2 transition-all hover:bg-background/90 focus-within:ring-2 ring-primary/20"
                    >
                        <div className="flex items-center gap-2 px-2">
                            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary rounded-xl">
                                <Plus className="h-5 w-5" />
                            </Button>
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask Tenex Intelligence anything..."
                                className="flex-1 border-none shadow-none focus-visible:ring-0 bg-transparent font-medium py-6 h-12"
                            />
                            <div className="flex items-center gap-1">
                                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary rounded-xl">
                                    <Mic className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="h-10 w-10 p-0 rounded-xl bg-primary shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between px-2 pb-1 border-t border-border/10 pt-1">
                            <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1">
                                {["Draft email", "Reschedule Sync", "Summarize week", "Audit meetings"].map((chip) => (
                                    <button key={chip} className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full bg-accent/50 hover:bg-primary/10 hover:text-primary transition-colors font-bold text-muted-foreground border border-transparent hover:border-primary/20 lowercase">
                                        {chip}
                                    </button>
                                ))}
                            </div>
                            <p className="hidden sm:block text-[9px] text-muted-foreground font-bold tracking-widest uppercase opacity-40">
                                Tenex AI v1.0
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
