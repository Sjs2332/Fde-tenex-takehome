"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { StatsGrid } from "./StatsGrid";
import { ScheduleCard } from "./ScheduleCard";
import { EmailDraftCard } from "./EmailDraftCard";
import { EventCreatedCard } from "./EventCreatedCard";
import { ToolStatus } from "./ToolStatus";
import { GoogleCalendarEvent } from "@/types/google/calendar";

interface MessageRendererProps {
    msg: any;
    events: GoogleCalendarEvent[];
    onEventClick: (event: GoogleCalendarEvent) => void;
    onEventCreated?: () => void;
}

/**
 * Extracts tool name and state from a message part, handling both
 * AI SDK v6 format (type: "tool-{name}") and legacy format (type: "tool-invocation").
 */
function getToolInfo(part: any): { toolName: string; state: string; output: any } | null {
    if (!part || typeof part.type !== "string") return null;

    // AI SDK v6 format: type is "tool-get_events", "tool-create_event", etc.
    if (part.type.startsWith("tool-") && part.type !== "tool-invocation") {
        return {
            toolName: part.type.replace("tool-", ""),
            state: part.state || "",
            output: part.output ?? null,
        };
    }

    // Legacy / fallback format: type is "tool-invocation"
    if (part.type === "tool-invocation") {
        const inv = part.toolInvocation || part;
        return {
            toolName: inv.toolName || "unknown",
            state: inv.state || "",
            output: inv.result ?? inv.output ?? null,
        };
    }

    return null;
}

/** Checks if a tool is still loading */
function isToolLoading(state: string): boolean {
    return ["input-streaming", "input-available", "call", "partial-call"].includes(state);
}

/** Checks if a tool has finished */
function isToolDone(state: string): boolean {
    return ["output-available", "result"].includes(state);
}

export function MessageRenderer({ msg, events, onEventClick, onEventCreated }: MessageRendererProps) {
    const rawText = getMessageText(msg);
    const parts: any[] = msg.parts || [];

    // Extract tool parts with normalized info
    const toolInfos = parts
        .map((part: any) => getToolInfo(part))
        .filter((info): info is NonNullable<typeof info> => info !== null);

    // Extract created events from completed create_event tool calls
    const createdEvents = toolInfos
        .filter(info => info.toolName === "create_event" && isToolDone(info.state) && info.output?.event)
        .map(info => info.output.event);

    // Parse widgets from text
    const showStats = rawText.includes("[WIDGET: STATS]");
    const showSchedule = rawText.includes("[WIDGET: SCHEDULE]");

    let emailDraft: { to: string; subject: string; body: string } | null = null;
    const emailMatch = rawText.match(/\[WIDGET:\s*EMAIL\]([\s\S]*?)\[\/WIDGET:\s*EMAIL\]/);
    if (emailMatch) {
        const inner = emailMatch[1];
        const toMatch = inner.match(/TO:\s*(.*?)\n/);
        const subjectMatch = inner.match(/SUBJECT:\s*(.*?)\n/);
        const bodyMatch = inner.match(/BODY:\s*([\s\S]*)$/);
        if (toMatch && subjectMatch && bodyMatch) {
            emailDraft = {
                to: toMatch[1].trim(),
                subject: subjectMatch[1].trim(),
                body: bodyMatch[1].trim(),
            };
        }
    }

    const cleanText = rawText
        .replace(/\[WIDGET: STATS\]/g, "")
        .replace(/\[WIDGET: SCHEDULE\]/g, "")
        .replace(/\[WIDGET:\s*EMAIL\][\s\S]*?\[\/WIDGET:\s*EMAIL\]/g, "");

    /**
     * Recursively walks React children and converts [[Event Name]] into clickable citation buttons.
     * This ensures citations work in paragraphs, table cells, list items, bold, etc.
     */
    function renderCitations(children: React.ReactNode, evts: GoogleCalendarEvent[], onClick: (e: GoogleCalendarEvent) => void): React.ReactNode {
        if (typeof children === "string") {
            const segments = children.split(/(\[\[.*?\]\])/g);
            if (segments.length === 1) return children; // no citations, return as-is
            return segments.map((seg, i) => {
                if (seg.startsWith("[[") && seg.endsWith("]]")) {
                    const summary = seg.slice(2, -2);
                    const linkedEvent = evts.find(e => e.summary === summary);
                    return (
                        <button
                            key={i}
                            onClick={() => linkedEvent && onClick(linkedEvent)}
                            className={cn(
                                "px-1.5 py-0.5 rounded-md text-[11px] font-bold transition-all mx-0.5 inline",
                                linkedEvent
                                    ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                                    : "bg-muted text-muted-foreground line-through opacity-50"
                            )}
                        >
                            {summary}
                        </button>
                    );
                }
                return <span key={i}>{seg}</span>;
            });
        }

        if (Array.isArray(children)) {
            return children.map((child, i) => (
                <span key={i}>{renderCitations(child, evts, onClick)}</span>
            ));
        }

        // If it's a React element with children, recurse into it
        if (children && typeof children === "object" && "props" in (children as any)) {
            return children; // don't break nested components
        }

        return children;
    }

    return (
        <div className="space-y-4">
            {/* Tool invocation status pills */}
            {toolInfos.map((info, i) => (
                <ToolStatus key={`tool-${i}`} toolName={info.toolName} state={info.state} />
            ))}

            {/* Widgets */}
            {showStats && <StatsGrid />}

            {/* Markdown body with citation links */}
            {cleanText.trim() && (
                <div className="prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-muted prose-pre:text-muted-foreground prose-a:text-blue-500">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            // Shared citation renderer for any text-containing element
                            p: ({ children }) => <p className="leading-relaxed">{renderCitations(children, events, onEventClick)}</p>,
                            td: ({ children }) => <td className="px-3 py-2 text-xs font-medium text-foreground/90">{renderCitations(children, events, onEventClick)}</td>,
                            li: ({ children }) => <li>{renderCitations(children, events, onEventClick)}</li>,
                            strong: ({ children }) => <strong>{renderCitations(children, events, onEventClick)}</strong>,
                            em: ({ children }) => <em>{renderCitations(children, events, onEventClick)}</em>,
                            table: ({ children }) => (
                                <div className="my-3 overflow-hidden rounded-xl border border-border/60 shadow-sm">
                                    <table className="w-full text-xs border-collapse">{children}</table>
                                </div>
                            ),
                            thead: ({ children }) => (
                                <thead className="bg-muted/50 border-b border-border/60">{children}</thead>
                            ),
                            th: ({ children }) => (
                                <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{children}</th>
                            ),
                            tr: ({ children }) => (
                                <tr className="border-b border-border/30 last:border-b-0 hover:bg-muted/20 transition-colors">{children}</tr>
                            ),
                        }}
                    >
                        {cleanText}
                    </ReactMarkdown>
                </div>
            )}

            {/* Email draft card */}
            {emailDraft && (
                <EmailDraftCard to={emailDraft.to} subject={emailDraft.subject} body={emailDraft.body} />
            )}

            {/* Event created confirmation cards */}
            {createdEvents.map((evt: any, i: number) => (
                <EventCreatedCard
                    key={`created-${i}`}
                    summary={evt.summary}
                    start={evt.start}
                    end={evt.end}
                    meetLink={evt.meetLink}
                    htmlLink={evt.htmlLink}
                />
            ))}

            {/* Schedule tracker */}
            {showSchedule && (
                <div className="mt-4 pt-4 border-t border-border/40">
                    <ScheduleCard />
                </div>
            )}
        </div>
    );
}

/** Extracts plain text from a message's parts array. */
function getMessageText(msg: any): string {
    if (msg.parts) {
        return msg.parts
            .filter((part: any) => part.type === "text")
            .map((part: any) => part.text)
            .join("");
    }
    return msg.content || "";
}
