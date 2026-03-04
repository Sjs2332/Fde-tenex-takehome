"use client";

import { useState } from "react";
import { Search, Clock, Calendar, SquarePen, History, MessageSquare } from "lucide-react";

export function ShellDashboardHeader() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const mockEvents = [
        { name: "Team Standup", time: "Mon 10:00 AM" },
        { name: "Design Review", time: "Mon 2:00 PM" },
        { name: "Sprint Planning", time: "Tue 9:00 AM" },
        { name: "1:1 with Manager", time: "Tue 3:30 PM" },
        { name: "Product Sync", time: "Wed 11:00 AM" },
    ];

    const mockHistory = [
        { id: "1", title: "Reschedule my 1:1 to Thursday", time: "Mar 3, 7:30 PM", active: true },
        { id: "2", title: "Draft email to team about sprint", time: "Mar 3, 6:15 PM", active: false },
        { id: "3", title: "Summarize my week", time: "Mar 2, 4:00 PM", active: false },
        { id: "4", title: "What meetings do I have tomorrow?", time: "Mar 1, 9:00 AM", active: false },
    ];

    const filteredEvents = searchQuery.trim()
        ? mockEvents.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : mockEvents;

    const showDropdown = isSearchFocused && filteredEvents.length > 0;

    return (
        <header className="grid grid-cols-3 h-16 shrink-0 items-center border-b bg-background/50 backdrop-blur-md px-6">
            <div className="flex items-center gap-4">
                <nav>
                    <ol className="flex items-center">
                        <li><span className="font-bold text-sm">AI Assistant</span></li>
                    </ol>
                </nav>
            </div>

            <div className="flex justify-center">
                <div className="relative w-full max-w-md group">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                    <input
                        placeholder="Search events, meetings, or tasks..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                        className="w-full bg-muted/50 pl-10 h-10 rounded-xl border-none text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                    {showDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/60 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="px-3 py-2 border-b bg-muted/30">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    {searchQuery ? "Search results" : "Upcoming events"}
                                </p>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto p-1.5">
                                {filteredEvents.map(event => (
                                    <button
                                        key={event.name}
                                        onClick={() => { setSearchQuery(event.name); setIsSearchFocused(false); }}
                                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-3"
                                    >
                                        <div className="flex-shrink-0 p-1.5 rounded-lg bg-primary/10">
                                            <Calendar className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate">{event.name}</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <Clock className="h-3 w-3 text-muted-foreground/50" />
                                                <p className="text-[11px] text-muted-foreground font-medium">{event.time}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-2 relative">
                {/* History button */}
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="h-9 w-9 rounded-xl bg-background border border-border/60 hover:bg-muted flex items-center justify-center transition-colors"
                >
                    <History className="h-4 w-4 text-muted-foreground" />
                </button>
                {/* History dropdown */}
                {showHistory && (
                    <div className="absolute top-full right-10 mt-2 w-[300px] rounded-xl p-2 border border-border/60 bg-card shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="px-2 py-1.5 mb-1 flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recent Chats</span>
                            <span className="text-[10px] font-medium text-muted-foreground/60">{mockHistory.length} total</span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto pr-1">
                            {mockHistory.map(conv => (
                                <button
                                    key={conv.id}
                                    onClick={() => setShowHistory(false)}
                                    className={`w-full flex flex-col items-start gap-1 p-2 rounded-lg cursor-pointer mb-1 transition-colors ${conv.active ? "bg-primary/10" : "hover:bg-muted"}`}
                                >
                                    <div className="flex items-center gap-2 w-full">
                                        <MessageSquare className={`h-3.5 w-3.5 flex-shrink-0 ${conv.active ? "text-primary" : "text-muted-foreground"}`} />
                                        <span className={`text-sm truncate font-medium ${conv.active ? "text-primary" : "text-foreground"}`}>{conv.title}</span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground ml-5.5">{conv.time}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {/* New Chat button */}
                <button className="h-9 w-9 rounded-xl bg-background border border-border/60 hover:bg-muted flex items-center justify-center transition-colors">
                    <SquarePen className="h-4 w-4 text-muted-foreground" />
                </button>
            </div>
        </header>
    );
}
