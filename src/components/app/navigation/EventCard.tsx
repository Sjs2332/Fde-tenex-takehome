"use client";

import React from "react";
import { Clock, Video, MapPin, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { GoogleCalendarEvent } from "@/types/google/calendar";
import { format, parseISO } from "date-fns";
import {
    EVENT_COLORS,
    getInitials,
    getEventStatus,
    getTimeUntilLabel,
} from "@/lib/calendar-utils";

interface EventCardProps {
    event: GoogleCalendarEvent;
    colorIndex: number;
    showDate?: boolean;
    onClick: () => void;
}

export function EventCard({ event, colorIndex, showDate, onClick }: EventCardProps) {
    const status = getEventStatus(event);
    const timeUntilLabel = getTimeUntilLabel(event);
    const startDT = event.start?.dateTime ? parseISO(event.start.dateTime) : null;
    const isDone = status === "done";
    const isInProgress = status === "in-progress";
    const isSoon = status === "soon";

    return (
        <div
            onClick={onClick}
            className={cn(
                "group transition-all rounded-2xl p-3 border border-transparent hover:border-border/50 cursor-pointer relative",
                isDone ? "hover:bg-muted/30 opacity-70" : "hover:bg-accent/40"
            )}>

            {/* Left accent bar */}
            <div className={cn(
                "absolute left-0 top-4 w-1 h-8 rounded-full",
                isDone
                    ? "bg-emerald-500/50"
                    : isInProgress
                        ? "bg-orange-400 animate-pulse"
                        : EVENT_COLORS[colorIndex % EVENT_COLORS.length]
            )} />

            <div className="flex flex-col gap-1.5 pl-3">
                {/* Title + Status Badge */}
                <div className="flex items-start justify-between gap-2">
                    <h4 className={cn(
                        "text-xs font-bold leading-tight truncate flex-1 group-hover:text-primary transition-colors",
                        isDone && "line-through text-muted-foreground"
                    )}>
                        {event.summary || "Untitled Event"}
                    </h4>

                    {status === "done" && (
                        <Badge className="h-4 text-[8px] bg-emerald-500 hover:bg-emerald-500 rounded-full px-1.5 shrink-0 gap-1">
                            <CheckCircle2 className="h-2 w-2" /> Done
                        </Badge>
                    )}
                    {status === "in-progress" && (
                        <Badge className="h-4 text-[8px] bg-orange-500 hover:bg-orange-500 rounded-full px-1.5 shrink-0 gap-1">
                            <Loader2 className="h-2 w-2 animate-spin" /> In Progress
                        </Badge>
                    )}
                    {(status === "soon" || status === "upcoming") && timeUntilLabel && (
                        <Badge className={cn(
                            "h-4 text-[8px] rounded-full px-1.5 shrink-0 whitespace-nowrap",
                            isSoon
                                ? "bg-primary hover:bg-primary"
                                : "bg-muted text-muted-foreground hover:bg-muted"
                        )}>
                            {timeUntilLabel}
                        </Badge>
                    )}
                </div>

                {/* Time */}
                <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>
                        {showDate && startDT ? `${format(startDT, "EEE d MMM")} · ` : ""}
                        {startDT ? format(startDT, "h:mm a") : "All Day"}
                    </span>
                </div>

                {/* Location / Meet */}
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
                    {event.conferenceData ? (
                        <Video className="h-3 w-3 text-blue-500 shrink-0" />
                    ) : (
                        <MapPin className="h-3 w-3 shrink-0" />
                    )}
                    <span className="truncate">
                        {event.conferenceData ? "Video Call" : event.location || "No location"}
                    </span>
                </div>

                {/* Attendees */}
                <div className="flex items-center justify-between mt-0.5">
                    <div className="flex -space-x-1.5">
                        {(event.attendees || []).slice(0, 4).map((attendee, j) => (
                            <Avatar key={j} className="h-5 w-5 border-2 border-background">
                                <AvatarFallback className="text-[7px] font-bold">
                                    {getInitials(attendee.email)}
                                </AvatarFallback>
                            </Avatar>
                        ))}
                        {(event.attendees?.length || 0) > 4 && (
                            <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center text-[8px] font-bold border-2 border-background">
                                +{(event.attendees?.length || 0) - 4}
                            </div>
                        )}
                        {!event.attendees?.length && (
                            <span className="text-[9px] text-muted-foreground/50 font-medium">No guests</span>
                        )}
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
            </div>
        </div>
    );
}
