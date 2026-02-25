"use client";

import React from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QUICK_ACTIONS, QuickAction } from "./quick-actions";

interface ChatInputFormProps {
    input: string;
    isStreaming: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onQuickAction: (action: QuickAction) => void;
}

export function ChatInputForm({
    input,
    isStreaming,
    onInputChange,
    onSubmit,
    onQuickAction,
}: ChatInputFormProps) {
    return (
        <form
            onSubmit={onSubmit}
            className="w-full bg-background border border-border/60 rounded-2xl shadow-xl p-2 flex flex-col gap-1 transition-all focus-within:border-primary/30 focus-within:shadow-2xl focus-within:shadow-primary/5"
        >
            <div className="flex items-center gap-2 px-3">
                <textarea
                    id="chat-input"
                    value={input}
                    onChange={onInputChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            onSubmit(e as unknown as React.FormEvent);
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
                        return (
                            <button
                                key={action.label}
                                type="button"
                                disabled={isStreaming}
                                onClick={() => onQuickAction(action)}
                                className={cn(
                                    "flex items-center gap-1.5 text-[10px] whitespace-nowrap px-2.5 py-1.5 rounded-full transition-all font-bold text-muted-foreground border border-transparent",
                                    "bg-accent/50 disabled:opacity-40 disabled:cursor-not-allowed",
                                    !isStreaming && action.color
                                )}
                            >
                                <Icon className="h-2.5 w-2.5" />
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
    );
}
