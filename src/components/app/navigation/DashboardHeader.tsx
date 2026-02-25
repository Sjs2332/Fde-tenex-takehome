"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Search, Clock, Calendar } from "lucide-react";
import { useCalendar } from "@/hooks/use-calendar";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
    title?: string;
}

export function DashboardHeader({ title = "AI Assistant" }: DashboardHeaderProps) {
    const { events } = useCalendar();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsSearchFocused(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const now = new Date();
    const upcomingEvents = events
        .filter(e => e.start?.dateTime && new Date(e.start.dateTime) > now)
        .sort((a, b) => new Date(a.start?.dateTime || "").getTime() - new Date(b.start?.dateTime || "").getTime())
        .slice(0, 8);

    const filteredEvents = searchQuery.trim()
        ? upcomingEvents.filter(e =>
            e.summary?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : upcomingEvents;

    const showDropdown = isSearchFocused && filteredEvents.length > 0;

    const formatTime = (dt: string) =>
        new Date(dt).toLocaleString("en-US", {
            weekday: "short", hour: "numeric", minute: "2-digit"
        });

    return (
        <header className="grid grid-cols-3 h-16 shrink-0 items-center border-b bg-background/50 backdrop-blur-md px-6 sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-bold">{title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex justify-center" ref={searchRef}>
                <div className="relative w-full max-w-md group">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary z-10" />
                    <Input
                        placeholder="Search events, meetings, or tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        className="w-full bg-muted/50 pl-10 h-10 rounded-xl border-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all font-medium"
                    />

                    {/* Event search dropdown */}
                    {showDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/60 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="px-3 py-2 border-b bg-muted/30">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    {searchQuery ? "Search results" : "Upcoming events"}
                                </p>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto p-1.5">
                                {filteredEvents.map((event, i) => (
                                    <button
                                        key={event.id || i}
                                        onClick={() => {
                                            setSearchQuery(event.summary || "");
                                            setIsSearchFocused(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-3 py-2.5 rounded-lg",
                                            "hover:bg-muted/50 transition-colors",
                                            "flex items-center gap-3"
                                        )}
                                    >
                                        <div className="flex-shrink-0 p-1.5 rounded-lg bg-primary/10">
                                            <Calendar className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate">{event.summary}</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <Clock className="h-3 w-3 text-muted-foreground/50" />
                                                <p className="text-[11px] text-muted-foreground font-medium">
                                                    {event.start?.dateTime ? formatTime(event.start.dateTime) : "All day"}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end" />
        </header>
    );
}
