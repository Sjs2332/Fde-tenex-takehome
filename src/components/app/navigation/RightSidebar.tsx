"use client";

import * as React from "react";
import {
    Calendar as LucideCalendar,
    Clock,
    Users,
    CheckCircle2,
    Sparkles,
    Bell,
    Settings2,
    StickyNote,
    Zap,
    Trophy,
    HelpCircle,
    ArrowRight,
    Video,
    MoreHorizontal
} from "lucide-react";
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
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function RightSidebar() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    const upcomingEvents = [
        {
            title: "Tenex Strategy Sync",
            time: "10:00 AM",
            type: "Video",
            attendees: 4,
            color: "bg-blue-500",
            status: "Soon"
        },
        {
            title: "Engineering Interview",
            time: "2:00 PM",
            type: "Meet",
            attendees: 2,
            color: "bg-green-500",
        },
        {
            title: "Product Roadmap",
            time: "4:30 PM",
            type: "Office",
            attendees: 8,
            color: "bg-purple-500",
        }
    ];

    return (
        <Sidebar
            side="right"
            collapsible="none"
            className="h-screen sticky top-0 border-l bg-sidebar/50 backdrop-blur-xl"
        >
            <SidebarHeader className="border-b h-16 flex items-center px-4">
                <div className="flex items-center justify-end gap-2 w-full">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl h-10 w-10 text-muted-foreground hover:text-foreground transition-all"
                    >
                        <Bell className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl h-10 w-10 text-muted-foreground hover:text-foreground transition-all"
                    >
                        <HelpCircle className="h-5 w-5" />
                    </Button>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-3 py-6 space-y-6 scrollbar-none overflow-y-auto">
                {/* Mini Calendar */}
                <SidebarGroup>
                    <SidebarGroupLabel className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">
                        Schedule Overview
                    </SidebarGroupLabel>
                    <SidebarGroupContent className="flex justify-center flex-col items-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-xl border-none shadow-none bg-transparent scale-90 origin-top"
                        />
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Upcoming Events */}
                <SidebarGroup>
                    <div className="flex items-center justify-between px-2 mb-3">
                        <SidebarGroupLabel className="p-0 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                            Upcoming
                        </SidebarGroupLabel>
                        <Button variant="ghost" size="sm" className="h-6 text-[9px] font-bold uppercase tracking-widest text-primary p-0 h-auto">
                            View All
                        </Button>
                    </div>
                    <SidebarGroupContent>
                        <div className="space-y-3">
                            {upcomingEvents.map((event, i) => (
                                <div key={i} className="group transition-all hover:bg-accent/40 rounded-2xl p-3 border border-transparent hover:border-border/50 cursor-pointer relative">
                                    <div className={cn("absolute left-0 top-4 w-1 h-8 rounded-full", event.color)} />
                                    <div className="flex flex-col gap-1.5 pl-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold leading-tight truncate pr-4 group-hover:text-primary transition-colors">{event.title}</h4>
                                            {event.status && <Badge className="h-4 text-[8px] bg-primary rounded-full px-1.5">{event.status}</Badge>}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{event.time}</span>
                                            </div>
                                            <span className="opacity-30">•</span>
                                            <span>{event.type}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map((j) => (
                                                    <Avatar key={j} className="h-5 w-5 border-2 border-background">
                                                        <AvatarImage src={`https://i.pravatar.cc/150?u=right${i}${j}`} />
                                                        <AvatarFallback>U</AvatarFallback>
                                                    </Avatar>
                                                ))}
                                                {event.attendees > 3 && (
                                                    <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center text-[8px] font-bold border-2 border-background">
                                                        +{event.attendees - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>


            </SidebarContent>

            <SidebarFooter className="border-t p-4">
                <Button className="w-full rounded-xl font-bold text-[11px] h-10 shadow-lg shadow-primary/20">
                    <LucideCalendar className="mr-2 h-4 w-4" /> Schedule New
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
