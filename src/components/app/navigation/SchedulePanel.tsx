"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { GoogleCalendarEvent } from "@/types/google/calendar";
import { format, parseISO, isSameDay, startOfDay, addDays, subDays, compareAsc } from "date-fns";
import { EventCard } from "@/components/app/navigation/EventCard";

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function ScheduleSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl p-3 border border-border/40 animate-pulse">
                    <div className="h-3 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-2 bg-muted rounded w-1/2" />
                </div>
            ))}
        </div>
    );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ label }: { label: string }) {
    return (
        <div className="py-8 text-center bg-accent/5 rounded-2xl border border-dashed border-border/50">
            <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">{label}</p>
        </div>
    );
}

// ─── Day Section ──────────────────────────────────────────────────────────────

function DaySection({
    label,
    events,
    onEventClick,
    isToday,
}: {
    label: string;
    events: GoogleCalendarEvent[];
    onEventClick: (e: GoogleCalendarEvent) => void;
    isToday: boolean;
}) {
    return (
        <div>
            <div className="flex items-center gap-2 px-1 mb-2">
                <p className={cn(
                    "text-[9px] font-black uppercase tracking-widest",
                    isToday ? "text-primary" : "text-muted-foreground/50"
                )}>
                    {label}
                </p>
                {isToday && (
                    <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                )}
            </div>
            <div className="space-y-2">
                {events.map((event, i) => (
                    <EventCard
                        key={event.id || i}
                        event={event}
                        colorIndex={i}
                        onClick={() => onEventClick(event)}
                    />
                ))}
            </div>
        </div>
    );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface SchedulePanelProps {
    events: GoogleCalendarEvent[];
    loading: boolean;
    selectedDate: Date | undefined;
    viewAll: boolean;
    onViewAll: () => void;
    onEventClick: (event: GoogleCalendarEvent) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SchedulePanel({
    events,
    loading,
    selectedDate,
    viewAll,
    onViewAll,
    onEventClick,
}: SchedulePanelProps) {

    const today = startOfDay(new Date());

    // Events for the selected calendar day, sorted chronologically
    const dayEvents = React.useMemo(() => {
        if (!selectedDate) return [];
        return events
            .filter((e) => {
                const dt = e.start?.dateTime || e.start?.date;
                if (!dt) return false;
                return isSameDay(parseISO(dt), selectedDate);
            })
            .sort((a, b) => {
                const aTime = a.start?.dateTime || a.start?.date || "";
                const bTime = b.start?.dateTime || b.start?.date || "";
                return compareAsc(parseISO(aTime), parseISO(bTime));
            });
    }, [events, selectedDate]);

    // For View All: past 30 days + next 30 days grouped by day, in order
    const allDayGroups = React.useMemo(() => {
        const days: Date[] = [];
        for (let i = 7; i >= 1; i--) days.push(subDays(today, i));    // past 7
        days.push(today);                                                   // today
        for (let i = 1; i <= 30; i++) days.push(addDays(today, i));    // future 30

        return days
            .map((day) => {
                const isToday = isSameDay(day, today);
                const label = isToday
                    ? "Today"
                    : isSameDay(day, subDays(today, 1))
                        ? "Yesterday"
                        : isSameDay(day, addDays(today, 1))
                            ? "Tomorrow"
                            : format(day, "EEEE · d MMM");

                const dayEvts = events
                    .filter((e) => {
                        const dt = e.start?.dateTime || e.start?.date;
                        if (!dt) return false;
                        return isSameDay(parseISO(dt), day);
                    })
                    .sort((a, b) => {
                        const aTime = a.start?.dateTime || a.start?.date || "";
                        const bTime = b.start?.dateTime || b.start?.date || "";
                        return compareAsc(parseISO(aTime), parseISO(bTime));
                    });

                return { day, label, events: dayEvts, isToday };
            })
            .filter((g) => g.events.length > 0);
    }, [events, today]);

    // Derive heading label
    const headingLabel = viewAll
        ? "This Week & Beyond"
        : selectedDate
            ? isSameDay(selectedDate, new Date())
                ? "Today"
                : format(selectedDate, "EEEE · MMM d")
            : "Schedule";

    return (
        <SidebarGroup className="flex flex-col min-h-0 flex-1 px-3 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between px-2 mb-3 shrink-0">
                <SidebarGroupLabel className="p-0 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                    {headingLabel}
                </SidebarGroupLabel>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onViewAll}
                    className={cn(
                        "text-[9px] font-bold uppercase tracking-widest p-0 h-auto transition-colors",
                        viewAll ? "text-primary" : "text-muted-foreground hover:text-primary"
                    )}
                >
                    {viewAll ? "By Day" : "View All"}
                </Button>
            </div>

            {/* Scrollable event list */}
            <SidebarGroupContent className="overflow-y-auto scrollbar-none flex-1">
                {loading ? (
                    <ScheduleSkeleton />
                ) : viewAll ? (
                    // ── View All: all days with events, chronological ──
                    <div className="space-y-6">
                        {allDayGroups.length === 0 ? (
                            <EmptyState label="No events in the past or next 30 days" />
                        ) : (
                            allDayGroups.map(({ day, label, events: dayEvts, isToday }) => (
                                <DaySection
                                    key={day.toISOString()}
                                    label={label}
                                    events={dayEvts}
                                    onEventClick={onEventClick}
                                    isToday={isToday}
                                />
                            ))
                        )}
                    </div>
                ) : (
                    // ── Single day view: all events for that day, chronological ──
                    <div className="space-y-2">
                        {dayEvents.length === 0 ? (
                            <EmptyState
                                label={
                                    selectedDate && isSameDay(selectedDate, new Date())
                                        ? "Nothing scheduled today"
                                        : `Nothing on ${selectedDate ? format(selectedDate, "MMM d") : "this day"}`
                                }
                            />
                        ) : (
                            dayEvents.map((event, i) => (
                                <EventCard
                                    key={event.id || i}
                                    event={event}
                                    colorIndex={i}
                                    onClick={() => onEventClick(event)}
                                />
                            ))
                        )}
                    </div>
                )}
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
