"use client";

import { Calendar, Clock, Video, ExternalLink, Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventCreatedCardProps {
    summary: string;
    start: string;
    end: string;
    meetLink?: string | null;
    htmlLink?: string;
    attendees?: string[];
}

/**
 * Renders a confirmation card when the AI agent creates a new calendar event.
 * Shows event details, a Google Meet link (if available), and a link to view in Google Calendar.
 */
export function EventCreatedCard({ summary, start, end, meetLink, htmlLink, attendees }: EventCreatedCardProps) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const dateStr = startDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
    });

    const timeStr = `${startDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} – ${endDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;

    const durationMs = endDate.getTime() - startDate.getTime();
    const durationMin = Math.round(durationMs / 60000);
    const durationStr = durationMin >= 60 ? `${Math.floor(durationMin / 60)}h ${durationMin % 60}m` : `${durationMin}m`;

    return (
        <div className="w-full max-w-[420px] my-3 rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="px-4 py-3 border-b bg-emerald-500/5 flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Event Created</p>
                </div>
            </div>

            {/* Body */}
            <div className="px-4 py-3 space-y-3">
                {/* Title */}
                <p className="text-sm font-bold text-foreground">{summary}</p>

                {/* Date & Time */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 shrink-0 opacity-60" />
                        <span className="font-medium">{dateStr}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 shrink-0 opacity-60" />
                        <span className="font-medium">{timeStr}</span>
                        <span className="text-[10px] text-muted-foreground/60 font-bold">({durationStr})</span>
                    </div>
                    {attendees && attendees.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="h-3.5 w-3.5 shrink-0 opacity-60" />
                            <span className="font-medium truncate">{attendees.join(", ")}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="px-4 py-2.5 border-t bg-muted/10 flex items-center gap-2">
                {meetLink && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 text-[11px] font-bold text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                        onClick={() => window.open(meetLink, "_blank")}
                    >
                        <Video className="h-3 w-3 mr-1.5" />
                        Join Meet
                    </Button>
                )}
                {htmlLink && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 text-[11px] font-bold text-muted-foreground hover:text-foreground"
                        onClick={() => window.open(htmlLink, "_blank")}
                    >
                        <ExternalLink className="h-3 w-3 mr-1.5" />
                        Open in Calendar
                    </Button>
                )}
            </div>
        </div>
    );
}
