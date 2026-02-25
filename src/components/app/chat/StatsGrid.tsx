"use client";

import React from "react";
import { Video, Clock, CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/hooks/use-calendar";
import { parseISO, isThisWeek, differenceInMinutes } from "date-fns";

export function StatsGrid() {
    const { events, loading } = useCalendar();

    // ─── Calculate real stats ─────────────────────────────────────────────────
    const thisWeekEvents = events.filter(e =>
        e.start?.dateTime && isThisWeek(parseISO(e.start.dateTime), { weekStartsOn: 1 })
    );

    const totalMeetingMinutes = thisWeekEvents.reduce((sum, e) => {
        if (!e.start?.dateTime || !e.end?.dateTime) return sum;
        return sum + differenceInMinutes(parseISO(e.end.dateTime), parseISO(e.start.dateTime));
    }, 0);

    const meetingHours = Math.round(totalMeetingMinutes / 60 * 10) / 10;

    // Assume 40hr work week, calculate focus hours remaining
    const focusHours = Math.max(0, Math.round((40 - meetingHours) * 10) / 10);

    // Events that have ended (done %)
    const now = new Date();
    const doneThisWeek = thisWeekEvents.filter(e =>
        e.end?.dateTime && parseISO(e.end.dateTime) < now
    ).length;
    const donePercent = thisWeekEvents.length > 0
        ? Math.round((doneThisWeek / thisWeekEvents.length) * 100)
        : 0;

    const stats = [
        {
            label: "Meetings",
            value: loading ? "..." : `${meetingHours}h`,
            delta: `${thisWeekEvents.length} events`,
            icon: Video,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            trend: meetingHours > 20 ? "down" : "up",
        },
        {
            label: "Focus Time",
            value: loading ? "..." : `${focusHours}h`,
            delta: "available",
            icon: Clock,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            trend: focusHours > 15 ? "up" : "down",
        },
        {
            label: "Completed",
            value: loading ? "..." : `${donePercent}%`,
            delta: `${doneThisWeek}/${thisWeekEvents.length}`,
            icon: CheckCircle2,
            color: "text-violet-500",
            bg: "bg-violet-500/10",
            trend: donePercent > 50 ? "up" : "down",
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-3 w-full max-w-[480px]">
            {stats.map((stat, i) => (
                <div key={i} className="bg-background border rounded-2xl p-3 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                    <div className={cn("p-1.5 w-fit rounded-lg mb-2", stat.bg)}>
                        <stat.icon className={cn("h-4 w-4", stat.color)} />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-black">{stat.value}</span>
                            <span className={cn(
                                "text-[9px] font-bold flex items-center gap-0.5",
                                stat.trend === "up" ? "text-emerald-500" : "text-amber-500"
                            )}>
                                {stat.trend === "up" ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                                {stat.delta}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
