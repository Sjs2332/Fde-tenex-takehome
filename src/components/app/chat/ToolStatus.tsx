"use client";

import { cn } from "@/lib/utils";

interface ToolStatusProps {
    toolName: string;
    state: string;
}

const TOOL_LABELS: Record<string, { loading: string; done: string }> = {
    get_events: { loading: "Checking your calendar…", done: "Calendar data loaded" },
    create_event: { loading: "Creating event…", done: "Event created ✓" },
    delete_event: { loading: "Removing event…", done: "Event removed ✓" },
};

/**
 * Renders a status pill for in-progress or completed tool invocations.
 *
 * Handles both AI SDK v6 states and legacy states:
 * Loading: "input-streaming" | "input-available" | "call" | "partial-call"
 * Done:    "output-available" | "result"
 * Error:   "output-error"
 */
export function ToolStatus({ toolName, state }: ToolStatusProps) {
    const isLoading = ["input-streaming", "input-available", "call", "partial-call"].includes(state);
    const isError = state === "output-error";

    const labels = TOOL_LABELS[toolName] || { loading: `Running ${toolName}…`, done: `${toolName} complete` };
    const label = isLoading ? labels.loading : isError ? `${toolName} failed` : labels.done;

    return (
        <div
            className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-500",
                isLoading
                    ? "bg-primary/5 border border-primary/15 text-primary"
                    : isError
                        ? "bg-red-500/5 border border-red-500/15 text-red-600"
                        : "bg-emerald-500/5 border border-emerald-500/15 text-emerald-600"
            )}
        >
            {isLoading ? (
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
                </svg>
            ) : isError ? (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ) : (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
            {label}
        </div>
    );
}
