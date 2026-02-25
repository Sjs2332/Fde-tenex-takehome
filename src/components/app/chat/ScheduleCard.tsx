"use client";

import React from "react";
import { Sparkles, Clock, ArrowRight, Video } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/hooks/use-calendar";
import { parseISO, format, isToday, isTomorrow } from "date-fns";
import { getEventStatus, getTimeUntilLabel } from "@/lib/calendar-utils";

export function ScheduleCard() {
    const { events, loading } = useCalendar();

    // Get upcoming events that haven't ended yet, limit to 3
    const now = new Date();
    const upcoming = events
        .filter(e => {
            if (!e.start?.dateTime) return false;
            const end = e.end?.dateTime ? parseISO(e.end.dateTime) : parseISO(e.start.dateTime);
            return end >= now;
        })
        .slice(0, 3);

    if (loading) {
        return (
            <Card className="w-full max-w-[400px] border-none shadow-sm bg-background overflow-hidden rounded-2xl animate-pulse">
                <CardHeader className="p-4 pb-2 border-b bg-muted/20">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Loading schedule...
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-10 rounded-lg bg-muted/50" />
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (upcoming.length === 0) {
        return (
            <Card className="w-full max-w-[400px] border-none shadow-sm bg-background overflow-hidden rounded-2xl">
                <CardHeader className="p-4 pb-2 border-b bg-muted/20">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Upcoming Schedule
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center">
                    <p className="text-sm text-muted-foreground font-medium">No upcoming events — your calendar is clear! 🎉</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-[400px] border-none shadow-sm bg-background overflow-hidden rounded-2xl group cursor-pointer hover:shadow-xl transition-all duration-300">
            <CardHeader className="p-4 pb-2 border-b bg-muted/20">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Upcoming Schedule
                    </CardTitle>
                    <Badge className="text-[10px] h-4 bg-primary rounded-full">{upcoming.length} Next</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {upcoming.map((event, i) => {
                    const startDT = event.start?.dateTime ? parseISO(event.start.dateTime) : null;
                    const status = getEventStatus(event);
                    const timeUntil = getTimeUntilLabel(event);
                    const isNow = status === "in-progress";

                    const dayLabel = startDT
                        ? isToday(startDT)
                            ? "Today"
                            : isTomorrow(startDT)
                                ? "Tomorrow"
                                : format(startDT, "EEE")
                        : "";

                    return (
                        <div key={event.id || i} className="flex items-center gap-3 p-3 px-4 hover:bg-accent/40 transition-colors border-b last:border-0 relative">
                            <div className={cn(
                                "w-1 h-6 rounded-full absolute left-0",
                                isNow ? "bg-orange-500 animate-pulse" : "bg-primary"
                            )} />
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold truncate">{event.summary || "Untitled"}</h4>
                                <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {dayLabel} {startDT ? format(startDT, "h:mm a") : "All Day"}
                                    </span>
                                    {event.conferenceData && (
                                        <span className="flex items-center gap-0.5 text-blue-500">
                                            <Video className="h-3 w-3" /> Meet
                                        </span>
                                    )}
                                </div>
                            </div>
                            {isNow ? (
                                <Badge className="text-[9px] h-4 px-1.5 bg-orange-500 hover:bg-orange-500 shrink-0">Now</Badge>
                            ) : timeUntil ? (
                                <Badge variant="outline" className="text-[9px] h-4 px-1 border-primary/20 text-primary shrink-0">{timeUntil}</Badge>
                            ) : null}
                            <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
