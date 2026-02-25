"use client";

import * as React from "react";
import { Calendar as LucideCalendar, HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
} from "@/components/ui/sidebar";

import { useCalendar } from "@/hooks/use-calendar";
import { GoogleCalendarEvent } from "@/types/google/calendar";

import { SchedulePanel } from "@/components/app/navigation/SchedulePanel";
import { CreateEventModal } from "@/components/app/navigation/CreateEventModal";
import { EventDetailModal } from "@/components/app/navigation/EventDetailModal";

export function RightSidebar() {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
    const [viewAll, setViewAll] = React.useState(false);
    const [isCreateOpen, setIsCreateOpen] = React.useState(false);
    const [detailEvent, setDetailEvent] = React.useState<GoogleCalendarEvent | null>(null);
    const [showHelp, setShowHelp] = React.useState(false);

    const { events, loading, refetch } = useCalendar();

    const handleDaySelect = (day: Date | undefined) => {
        setSelectedDate(day);
        setViewAll(false);
    };

    const handleViewAll = () => {
        setViewAll(true);
        setSelectedDate(undefined);
    };

    return (
        <>
            <Sidebar
                side="right"
                collapsible="none"
                className="h-screen sticky top-0 border-l bg-sidebar/50 backdrop-blur-xl flex flex-col"
            >
                {/* Header */}
                <SidebarHeader className="border-b h-16 flex items-center px-4 shrink-0">
                    <div className="flex items-center justify-end gap-2 w-full relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl h-10 w-10 text-muted-foreground hover:text-foreground transition-all"
                            onClick={() => setShowHelp(!showHelp)}
                        >
                            <HelpCircle className="h-5 w-5" />
                        </Button>

                        {/* Help Popup */}
                        {showHelp && (
                            <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-border/60 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">How to use Tenex</h4>
                                    <button onClick={() => setShowHelp(false)} className="text-muted-foreground hover:text-foreground">
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                <div className="p-4 space-y-3 text-xs text-muted-foreground">
                                    <div className="space-y-1">
                                        <p className="font-bold text-foreground">💬 Ask AI anything</p>
                                        <p>Type natural language questions about your calendar, schedule meetings, or reschedule events.</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-foreground">⚡ Quick Actions</p>
                                        <p>Use the chips below the input to draft emails, summarize your week, audit meetings, or reschedule.</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-foreground">📅 Calendar</p>
                                        <p>Click any day on the calendar to filter events. Click &quot;View All&quot; to see everything.</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-foreground">🔍 Search</p>
                                        <p>Use the search bar in the header to quickly find events by name.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </SidebarHeader>

                <SidebarContent className="flex flex-col min-h-0 overflow-hidden">
                    {/* Mini Calendar */}
                    <SidebarGroup className="shrink-0 px-3 pt-4 pb-0">
                        <SidebarGroupLabel className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">
                            Schedule Overview
                        </SidebarGroupLabel>
                        <SidebarGroupContent className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDaySelect}
                                className="rounded-xl border-none shadow-none bg-transparent scale-90 origin-top"
                            />
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* Schedule Panel */}
                    <SchedulePanel
                        events={events}
                        loading={loading}
                        selectedDate={selectedDate}
                        viewAll={viewAll}
                        onViewAll={handleViewAll}
                        onEventClick={setDetailEvent}
                    />
                </SidebarContent>

                {/* Footer */}
                <SidebarFooter className="border-t p-4 shrink-0">
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="w-full rounded-xl font-bold text-[11px] h-12 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <LucideCalendar className="mr-2 h-4 w-4" /> Schedule New
                    </Button>
                </SidebarFooter>
            </Sidebar>

            <CreateEventModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={refetch}
            />
            <EventDetailModal
                event={detailEvent}
                isOpen={!!detailEvent}
                onClose={() => setDetailEvent(null)}
            />
        </>
    );
}
