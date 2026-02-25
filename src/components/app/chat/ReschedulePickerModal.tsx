"use client";

import React from "react";
import { GoogleCalendarEvent } from "@/types/google/calendar";
import { Calendar, Clock, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReschedulePickerModalProps {
    isOpen: boolean;
    events: GoogleCalendarEvent[];
    onSelect: (event: GoogleCalendarEvent) => void;
    onClose: () => void;
}

/**
 * Modal that shows upcoming meetings for the user to pick which one to reschedule.
 * Renders as a floating overlay with a polished event list.
 */
export function ReschedulePickerModal({ isOpen, events, onSelect, onClose }: ReschedulePickerModalProps) {
    if (!isOpen) return null;

    const now = new Date();
    const upcoming = events
        .filter(e => e.start?.dateTime && new Date(e.start.dateTime) > now)
        .sort((a, b) => {
            const aTime = new Date(a.start?.dateTime || "").getTime();
            const bTime = new Date(b.start?.dateTime || "").getTime();
            return aTime - bTime;
        })
        .slice(0, 10);

    const formatTime = (dt: string) =>
        new Date(dt).toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });

    const getDuration = (start: string, end: string) => {
        const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
        return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? `${mins % 60}m` : ""}` : `${mins}m`;
    };

    const EVENT_COLORS = [
        "border-l-blue-500",
        "border-l-violet-500",
        "border-l-emerald-500",
        "border-l-amber-500",
        "border-l-rose-500",
        "border-l-cyan-500",
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-md mx-4 bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b bg-muted/30">
                    <div>
                        <h3 className="text-sm font-bold text-foreground">Reschedule a Meeting</h3>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Choose which meeting to reschedule</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Event list */}
                <div className="max-h-[400px] overflow-y-auto p-3 space-y-2">
                    {upcoming.length === 0 ? (
                        <div className="py-12 text-center">
                            <Calendar className="h-8 w-8 mx-auto text-muted-foreground/40 mb-3" />
                            <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">
                                No upcoming meetings to reschedule
                            </p>
                        </div>
                    ) : (
                        upcoming.map((event, i) => (
                            <button
                                key={event.id || i}
                                onClick={() => onSelect(event)}
                                className={cn(
                                    "w-full text-left px-4 py-3 rounded-xl border border-border/40 bg-background",
                                    "border-l-[3px] transition-all duration-200",
                                    "hover:bg-muted/40 hover:border-border hover:shadow-sm",
                                    "active:scale-[0.98]",
                                    EVENT_COLORS[i % EVENT_COLORS.length]
                                )}
                            >
                                <p className="text-sm font-bold text-foreground truncate">
                                    {event.summary || "(No title)"}
                                </p>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                        <Clock className="h-3 w-3 opacity-60" />
                                        <span className="font-medium">
                                            {event.start?.dateTime ? formatTime(event.start.dateTime) : "All day"}
                                        </span>
                                    </div>
                                    {event.start?.dateTime && event.end?.dateTime && (
                                        <span className="text-[10px] text-muted-foreground/50 font-bold">
                                            {getDuration(event.start.dateTime, event.end.dateTime)}
                                        </span>
                                    )}
                                    {event.attendees && event.attendees.length > 0 && (
                                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                            <Users className="h-3 w-3 opacity-60" />
                                            <span className="font-medium">{event.attendees.length}</span>
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
