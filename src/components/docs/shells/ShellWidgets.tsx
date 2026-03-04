"use client";

import React, { useState } from "react";
import {
    Video, Clock, CheckCircle2, TrendingUp, TrendingDown,
    Calendar, Check, Users, ExternalLink,
    Copy, Send, Edit3,
    Sparkles, ArrowRight, MapPin, X, AlignLeft,
    Loader2,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   1. StatsGrid Shell
   ═══════════════════════════════════════════════════════════════════ */
export function ShellStatsGrid() {
    const stats = [
        { label: "Meetings", value: "6.2h", delta: "8 events", icon: Video, color: "text-blue-500", bg: "bg-blue-500/10", trend: "up" as const },
        { label: "Focus Time", value: "33.8h", delta: "available", icon: Clock, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "up" as const },
        { label: "Completed", value: "62%", delta: "5/8", icon: CheckCircle2, color: "text-violet-500", bg: "bg-violet-500/10", trend: "up" as const },
    ];

    return (
        <div className="grid grid-cols-3 gap-3 w-full max-w-[480px]">
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <div key={i} className="bg-background border rounded-2xl p-3 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                        <div className={`p-1.5 w-fit rounded-lg mb-2 ${stat.bg}`}>
                            <Icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-lg font-black">{stat.value}</span>
                                <span className={`text-[9px] font-bold flex items-center gap-0.5 ${stat.trend === "up" ? "text-emerald-500" : "text-amber-500"}`}>
                                    {stat.trend === "up" ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                                    {stat.delta}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   2. EventCreatedCard Shell
   ═══════════════════════════════════════════════════════════════════ */
export function ShellEventCreatedCard() {
    return (
        <div className="w-full max-w-[420px] rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b bg-emerald-500/5 flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Event Created</p>
            </div>
            <div className="px-4 py-3 space-y-3">
                <p className="text-sm font-bold text-foreground">Weekly Team Standup</p>
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 shrink-0 opacity-60" />
                        <span className="font-medium">Monday, Mar 10</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 shrink-0 opacity-60" />
                        <span className="font-medium">10:00 AM – 10:30 AM</span>
                        <span className="text-[10px] text-muted-foreground/60 font-bold">(30m)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5 shrink-0 opacity-60" />
                        <span className="font-medium truncate">alice@co.com, bob@co.com</span>
                    </div>
                </div>
            </div>
            <div className="px-4 py-2.5 border-t bg-muted/10 flex items-center gap-2">
                <button className="h-7 px-2.5 text-[11px] font-bold text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 flex items-center gap-1.5 rounded-md transition-colors">
                    <Video className="h-3 w-3" /> Join Meet
                </button>
                <button className="h-7 px-2.5 text-[11px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-md transition-colors">
                    <ExternalLink className="h-3 w-3" /> Open in Calendar
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   3. EmailDraftCard Shell — interactive edit/copy but no real send
   ═══════════════════════════════════════════════════════════════════ */
export function ShellEmailDraftCard() {
    const [isEditing, setIsEditing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [draftTo, setDraftTo] = useState("bob@company.com");
    const [draftSubject, setDraftSubject] = useState("Re: Sprint Planning — Agenda Update");
    const [draftBody, setDraftBody] = useState(`Hi Bob,

Hope you're doing well. I wanted to share the updated agenda for tomorrow's sprint planning session:

1. Review velocity from Sprint 23
2. Discuss carry-over items
3. Sprint 24 goal alignment

Let me know if you'd like to add anything.

Best,
Jawad`);

    const handleCopy = () => {
        navigator.clipboard.writeText(`To: ${draftTo}\nSubject: ${draftSubject}\n\n${draftBody}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-[500px] rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b bg-muted/30 space-y-3">
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider w-14 shrink-0">To</span>
                    {isEditing ? (
                        <input value={draftTo} onChange={e => setDraftTo(e.target.value)} className="h-7 text-sm px-2 bg-background border border-muted rounded-md flex-1 focus:outline-none focus:ring-1 focus:ring-primary/50" />
                    ) : (
                        <span className="text-sm font-medium">{draftTo}</span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider w-14 shrink-0">Subject</span>
                    {isEditing ? (
                        <input value={draftSubject} onChange={e => setDraftSubject(e.target.value)} className="h-7 text-sm px-2 font-semibold bg-background border border-muted rounded-md flex-1 focus:outline-none focus:ring-1 focus:ring-primary/50" />
                    ) : (
                        <span className="text-sm font-semibold text-foreground">{draftSubject}</span>
                    )}
                </div>
            </div>
            <div className="p-5 bg-background">
                {isEditing ? (
                    <textarea value={draftBody} onChange={e => setDraftBody(e.target.value)} className="min-h-[150px] w-full text-sm leading-relaxed p-0 border-none focus:outline-none resize-y bg-transparent" />
                ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-[450] text-foreground/90">{draftBody}</p>
                )}
            </div>
            <div className="px-4 py-3 bg-muted/10 border-t flex items-center justify-between gap-2">
                <button onClick={() => setIsEditing(!isEditing)} className="h-8 px-3 text-xs font-semibold hover:bg-muted flex items-center gap-1.5 rounded-md text-muted-foreground transition-colors">
                    {isEditing ? <><Check className="h-3.5 w-3.5" /> Done</> : <><Edit3 className="h-3.5 w-3.5 opacity-70" /> Edit</>}
                </button>
                <div className="flex gap-2">
                    {!isEditing && (
                        <button onClick={handleCopy} className="h-8 px-3 text-xs font-semibold hover:bg-muted flex items-center gap-1.5 rounded-md text-muted-foreground transition-colors">
                            {copied ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied</> : <><Copy className="h-3.5 w-3.5 opacity-70" /> Copy</>}
                        </button>
                    )}
                    <button className="h-8 px-4 text-xs font-bold rounded-lg shadow-sm bg-primary text-primary-foreground flex items-center gap-1.5 opacity-60 cursor-not-allowed" title="Disabled in demo">
                        <Send className="h-3.5 w-3.5" /> Send Email
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   4. ScheduleCard Shell
   ═══════════════════════════════════════════════════════════════════ */
export function ShellScheduleCard() {
    const upcoming = [
        { name: "Design Review", time: "Today 10:00 AM", hasVideo: true, until: "In 30m" },
        { name: "Sprint Planning", time: "Today 1:00 PM", hasVideo: false, until: "In 3h" },
        { name: "1:1 with Manager", time: "Today 3:30 PM", hasVideo: true, until: "In 5h" },
    ];

    return (
        <div className="w-full max-w-[400px] border-none shadow-sm bg-background overflow-hidden rounded-2xl group cursor-pointer hover:shadow-xl transition-all duration-300">
            <div className="p-4 pb-2 border-b bg-muted/20">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />Upcoming Schedule
                    </h3>
                    <span className="text-[10px] h-4 bg-primary text-primary-foreground rounded-full px-1.5 flex items-center font-bold">{upcoming.length} Next</span>
                </div>
            </div>
            <div>
                {upcoming.map((event, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 px-4 hover:bg-accent/40 transition-colors border-b last:border-0 relative">
                        <div className="w-1 h-6 rounded-full absolute left-0 bg-primary" />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold truncate">{event.name}</h4>
                            <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{event.time}</span>
                                {event.hasVideo && <span className="flex items-center gap-0.5 text-blue-500"><Video className="h-3 w-3" /> Meet</span>}
                            </div>
                        </div>
                        <span className="text-[9px] h-4 px-1 border border-primary/20 text-primary shrink-0 rounded-full flex items-center font-bold">{event.until}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   5. ToolStatus Shell — shows all 3 states
   ═══════════════════════════════════════════════════════════════════ */
export function ShellToolStatus() {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/5 border border-emerald-500/15 text-emerald-600 w-fit">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Calendar data loaded
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-primary/5 border border-primary/15 text-primary w-fit">
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
                </svg>
                Creating event…
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/5 border border-emerald-500/15 text-emerald-600 w-fit">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Event created ✓
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   6. EventCard Shell — clickable event cards that open detail popup
   ═══════════════════════════════════════════════════════════════════ */
function EventCardDetailPopup({ event, onClose }: { event: { name: string; time: string; hasVideo: boolean; attendees: string[] }; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-[520px] mx-4 bg-background/95 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="bg-primary/5 px-6 pt-6 pb-5 border-b border-primary/10">
                    <div className="flex items-start gap-3">
                        <div className="bg-primary/10 w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"><Calendar className="h-5 w-5 text-primary" /></div>
                        <div className="flex-1"><h3 className="text-lg font-black tracking-tight">{event.name}</h3><span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full mt-2 inline-block">Soon</span></div>
                        <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center"><X className="h-4 w-4" /></button>
                    </div>
                </div>
                <div className="px-6 py-5 space-y-4">
                    <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0"><Clock className="h-4 w-4 text-muted-foreground" /></div><div><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Time</p><p className="text-sm font-semibold">{event.time}</p></div></div>
                    <div className="border-t border-border/30" />
                    <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0">{event.hasVideo ? <Video className="h-4 w-4 text-blue-500" /> : <MapPin className="h-4 w-4 text-muted-foreground" />}</div><div><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{event.hasVideo ? "Video Call" : "Location"}</p>{event.hasVideo ? <button className="rounded-xl h-8 text-xs font-bold border border-blue-500/30 text-blue-500 hover:bg-blue-500/10 px-3 flex items-center gap-2 transition-colors mt-1"><Video className="h-3 w-3" /> Join Meet <ExternalLink className="h-3 w-3 opacity-60" /></button> : <p className="text-sm font-medium">Conference Room A</p>}</div></div>
                    <div className="border-t border-border/30" />
                    <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0"><Users className="h-4 w-4 text-muted-foreground" /></div><div><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Attendees ({event.attendees.length})</p><div className="flex gap-2 mt-1">{event.attendees.map(a => <div key={a} className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">{a}</div>)}</div></div></div>
                </div>
            </div>
        </div>
    );
}

export function ShellEventCard() {
    const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);

    return (
        <>
            <div className="space-y-2 w-full max-w-[300px]">
                {events.map((event) => (
                    <div key={event.name} onClick={() => setSelectedEvent(event)} className="group transition-all rounded-2xl p-3 border border-transparent hover:border-border/50 cursor-pointer relative hover:bg-accent/40">
                        <div className={`absolute left-0 top-4 w-1 h-8 rounded-full ${event.color}`} />
                        <div className="flex flex-col gap-1.5 pl-3">
                            <div className="flex items-start justify-between gap-2">
                                <h4 className="text-xs font-bold leading-tight truncate flex-1 group-hover:text-primary transition-colors">{event.name}</h4>
                                <span className={`inline-flex items-center h-4 text-[8px] rounded-full px-1.5 shrink-0 whitespace-nowrap font-bold ${event.status === "soon" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{event.statusLabel}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                                <Clock className="h-3 w-3 shrink-0" /><span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
                                {event.hasVideo ? <Video className="h-3 w-3 text-blue-500 shrink-0" /> : <MapPin className="h-3 w-3 shrink-0" />}
                                <span className="truncate">{event.hasVideo ? "Video Call" : "Conference Room A"}</span>
                            </div>
                            <div className="flex items-center justify-between mt-0.5">
                                <div className="flex -space-x-1.5">
                                    {event.attendees.slice(0, 4).map((a) => (
                                        <div key={a} className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[7px] font-bold border-2 border-background">{a}</div>
                                    ))}
                                    {event.attendees.length > 4 && (
                                        <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center text-[8px] font-bold border-2 border-background">+{event.attendees.length - 4}</div>
                                    )}
                                </div>
                                <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {selectedEvent && <EventCardDetailPopup event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
        </>
    );
}

const events = [
    { name: "Design Review", time: "10:00 AM", hasVideo: true, status: "soon" as const, statusLabel: "In 30m", attendees: ["AJ", "KM"], color: "bg-blue-500" },
    { name: "Sprint Planning", time: "1:00 PM", hasVideo: false, status: "upcoming" as const, statusLabel: "In 3h", attendees: ["SJ", "RL", "DW"], color: "bg-violet-500" },
    { name: "Team Retrospective", time: "4:00 PM", hasVideo: true, status: "upcoming" as const, statusLabel: "In 6h", attendees: ["AJ", "KM", "SJ", "RL", "DW"], color: "bg-emerald-500" },
];

/* ═══════════════════════════════════════════════════════════════════
   7. ReschedulePickerModal Shell — inline (not a real modal)
   ═══════════════════════════════════════════════════════════════════ */
export function ShellReschedulePickerModal() {
    const EVENT_COLORS = ["border-l-blue-500", "border-l-violet-500", "border-l-emerald-500", "border-l-amber-500"];
    const mockEvents = [
        { name: "Design Review", time: "Mon, Mar 10, 10:00 AM", duration: "1h", attendees: 3 },
        { name: "Sprint Planning", time: "Mon, Mar 10, 1:00 PM", duration: "1h 30m", attendees: 5 },
        { name: "1:1 with Manager", time: "Tue, Mar 11, 3:30 PM", duration: "30m", attendees: 1 },
        { name: "Product Sync", time: "Wed, Mar 12, 11:00 AM", duration: "45m", attendees: 4 },
    ];

    return (
        <div className="w-full max-w-md bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b bg-muted/30">
                <div>
                    <h3 className="text-sm font-bold text-foreground">Reschedule a Meeting</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Choose which meeting to reschedule</p>
                </div>
                <button className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
                    <X className="h-4 w-4 text-muted-foreground" />
                </button>
            </div>
            <div className="p-3 space-y-2">
                {mockEvents.map((event, i) => (
                    <button key={event.name} className={`w-full text-left px-4 py-3 rounded-xl border border-border/40 bg-background border-l-[3px] transition-all duration-200 hover:bg-muted/40 hover:border-border hover:shadow-sm active:scale-[0.98] ${EVENT_COLORS[i % EVENT_COLORS.length]}`}>
                        <p className="text-sm font-bold text-foreground truncate">{event.name}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Clock className="h-3 w-3 opacity-60" />
                                <span className="font-medium">{event.time}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground/50 font-bold">{event.duration}</span>
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Users className="h-3 w-3 opacity-60" />
                                <span className="font-medium">{event.attendees}</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   8. CreateEventModal Shell — inline form, interactive but no submit
   ═══════════════════════════════════════════════════════════════════ */
export function ShellCreateEventModal() {
    const [title, setTitle] = useState("Quarterly Strategy Sync");
    const [location, setLocation] = useState("Headquarters, Level 4");
    const [guests, setGuests] = useState("team@tenex.ai, design@tenex.ai");
    const [description, setDescription] = useState("Review Q1 metrics and align on Q2 goals.");
    const [isGoogleMeeting, setIsGoogleMeeting] = useState(true);

    return (
        <div className="w-full max-w-[800px] bg-background/95 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden border border-border/40">
            <div className="bg-primary/5 px-8 py-8 border-b border-primary/10">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight">Schedule Intelligence</h3>
                        <p className="text-sm font-medium text-muted-foreground mt-1">Create a new calendar event with Google Meet integration.</p>
                    </div>
                </div>
            </div>

            <div className="px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">Event Title</label>
                            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full h-12 rounded-xl border border-border/50 bg-background/50 px-3 font-medium focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">Start Time</label>
                                <input type="datetime-local" defaultValue="2026-03-10T10:00" className="w-full h-12 rounded-xl border border-border/50 bg-background/50 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">End Time</label>
                                <input type="datetime-local" defaultValue="2026-03-10T11:00" className="w-full h-12 rounded-xl border border-border/50 bg-background/50 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2"><MapPin className="h-3 w-3" /> Location</label>
                            <input value={location} onChange={e => setLocation(e.target.value)} className="w-full h-12 rounded-xl border border-border/50 bg-background/50 px-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10 transition-all hover:bg-primary/10">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/20 p-2 rounded-lg text-primary"><Video className="h-4 w-4" /></div>
                                <div className="grid">
                                    <span className="text-sm font-bold">Google Meet</span>
                                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Add video link</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsGoogleMeeting(!isGoogleMeeting)}
                                className={`relative w-10 h-6 rounded-full transition-colors ${isGoogleMeeting ? "bg-primary" : "bg-muted"}`}
                            >
                                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isGoogleMeeting ? "left-5" : "left-1"}`} />
                            </button>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2"><Users className="h-3 w-3" /> Guests</label>
                            <input value={guests} onChange={e => setGuests(e.target.value)} className="w-full h-12 rounded-xl border border-border/50 bg-background/50 px-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                            <p className="text-[10px] text-muted-foreground/60 font-medium px-1">Separate emails with commas</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2"><AlignLeft className="h-3 w-3" /> Description & Agenda</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full min-h-[148px] rounded-xl border border-border/50 bg-background/50 px-3 py-3 resize-none leading-relaxed text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-8 py-6 bg-muted/30 border-t border-border/50 flex items-center justify-end gap-3">
                <button className="rounded-xl font-bold text-xs uppercase tracking-widest h-12 px-6 hover:bg-muted transition-colors text-muted-foreground">Cancel</button>
                <button className="rounded-xl font-bold text-xs uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 h-12 px-8 flex items-center gap-2 min-w-[180px] justify-center opacity-60 cursor-not-allowed" title="Disabled in demo">
                    <Calendar className="h-4 w-4" /> Create Event
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   9. EventDetailModal Shell — inline card version
   ═══════════════════════════════════════════════════════════════════ */
export function ShellEventDetailModal() {
    return (
        <div className="w-full max-w-[520px] bg-background/95 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden border border-border/40">
            <div className="bg-primary/5 px-6 pt-6 pb-5 border-b border-primary/10">
                <div className="flex items-start justify-between gap-3">
                    <div className="bg-primary/10 w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5">
                        <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-black tracking-tight leading-snug">Weekly Design Sync</h3>
                        <div className="mt-2">
                            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                <Loader2 className="h-3 w-3 animate-spin" /> In Progress
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-6 py-5 space-y-4">
                {/* Date & Time */}
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0"><Clock className="h-4 w-4 text-muted-foreground" /></div>
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Date & Time</p>
                        <p className="text-sm font-semibold">Monday, March 10, 2026</p>
                        <p className="text-sm text-muted-foreground font-medium">10:00 AM – 11:00 AM</p>
                    </div>
                </div>
                <div className="border-t border-border/30" />
                {/* Video Call */}
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0"><Video className="h-4 w-4 text-blue-500" /></div>
                    <div className="space-y-1 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Video Call</p>
                        <button className="rounded-xl h-8 text-xs font-bold gap-2 border border-blue-500/30 text-blue-500 hover:bg-blue-500/10 hover:text-blue-600 px-3 flex items-center transition-colors">
                            <Video className="h-3 w-3" /> Join Google Meet <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
                        </button>
                    </div>
                </div>
                <div className="border-t border-border/30" />
                {/* Attendees */}
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0"><Users className="h-4 w-4 text-muted-foreground" /></div>
                    <div className="space-y-2 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Guests (3)</p>
                        <div className="space-y-2">
                            {[
                                { name: "Alice Johnson", email: "alice@tenex.ai", status: "accepted" },
                                { name: "Bob Martinez", email: "bob@tenex.ai", status: "accepted" },
                                { name: "Carol Wu", email: "carol@tenex.ai", status: "needsAction" },
                            ].map((a) => (
                                <div key={a.email} className="flex items-center gap-2.5">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary shrink-0">
                                        {a.name.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold leading-tight truncate">{a.name}</p>
                                        <p className="text-[10px] text-muted-foreground truncate">{a.email}</p>
                                    </div>
                                    <span className={`ml-auto text-[9px] font-bold uppercase tracking-wide shrink-0 ${a.status === "accepted" ? "text-emerald-500" : "text-muted-foreground"}`}>
                                        {a.status === "needsAction" ? "Invited" : a.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="border-t border-border/30" />
                {/* Description */}
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0"><AlignLeft className="h-4 w-4 text-muted-foreground" /></div>
                    <div className="space-y-1 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Description</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">Weekly sync to review design progress, discuss blockers, and align on priorities for the upcoming sprint.</p>
                    </div>
                </div>
                {/* Open in Calendar */}
                <button className="w-full rounded-xl h-10 text-xs font-bold gap-2 text-muted-foreground hover:text-foreground border border-border/50 hover:bg-accent/60 mt-2 flex items-center justify-center transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" /> Open in Google Calendar
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   10. ChatMessagesList Shell — with StatsGrid + Citations
   ═══════════════════════════════════════════════════════════════════ */
function MiniStatsGrid() {
    const stats = [
        { label: "Meetings", value: "6.2h", delta: "8 events", color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Focus Time", value: "33.8h", delta: "available", color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Completed", value: "62%", delta: "5/8", color: "text-violet-500", bg: "bg-violet-500/10" },
    ];
    return (
        <div className="grid grid-cols-3 gap-2 w-full mt-3">
            {stats.map((s, i) => (
                <div key={i} className="bg-background border rounded-xl p-2 shadow-sm">
                    <div className={`p-1 w-fit rounded-md mb-1 ${s.bg}`}><Video className={`h-3 w-3 ${s.color}`} /></div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">{s.label}</p>
                    <div className="flex items-baseline gap-1"><span className="text-base font-black">{s.value}</span><span className="text-[8px] font-bold text-emerald-500">{s.delta}</span></div>
                </div>
            ))}
        </div>
    );
}

const CITATION_DATA: Record<string, { time: string; hasVideo: boolean; attendees: string[] }> = {
    "Design Review": { time: "10:00 AM – 11:00 AM", hasVideo: true, attendees: ["Alice Johnson", "Kyle Martinez"] },
    "Sprint Planning": { time: "1:00 PM – 2:30 PM", hasVideo: false, attendees: ["Sarah Jones", "Ryan Lee", "Diana Wu"] },
    "1:1 with Manager": { time: "3:30 PM – 4:00 PM", hasVideo: true, attendees: ["Pat Morgan"] },
};

function CitationBtn({ name }: { name: string }) {
    const [open, setOpen] = useState(false);
    const ev = CITATION_DATA[name];
    return (
        <span className="relative inline-block">
            <button onClick={() => setOpen(!open)} className="px-1.5 py-0.5 rounded-md text-[11px] font-bold transition-all mx-0.5 inline bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">{name}</button>
            {open && ev && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-card border border-border/60 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-primary/5">
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /><h4 className="text-sm font-bold">{name}</h4></div>
                        <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5 opacity-60" /><span className="font-medium">{ev.time}</span></div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">{ev.hasVideo ? <Video className="h-3.5 w-3.5 text-blue-500" /> : <MapPin className="h-3.5 w-3.5 opacity-60" />}<span className="font-medium">{ev.hasVideo ? "Google Meet" : "Conference Room A"}</span></div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Users className="h-3.5 w-3.5 opacity-60" /><span className="font-medium">{ev.attendees.join(", ")}</span></div>
                        <button className="w-full mt-1 rounded-lg h-7 text-[10px] font-bold text-muted-foreground hover:text-foreground border border-border/50 hover:bg-accent/60 flex items-center justify-center gap-1.5 transition-colors"><ExternalLink className="h-3 w-3" /> Open in Calendar</button>
                    </div>
                </div>
            )}
        </span>
    );
}

export function ShellChatMessagesList() {
    const TenexLogo = () => (
        <svg width="24" height="24" viewBox="0 0 60 43" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="0.000183105" width="60" height="42.6168" fill="#FFE501" rx="4" />
            <rect x="16.3604" y="7.48938" width="27.3999" height="8.27911" transform="rotate(90 16.3604 7.48938)" fill="black" />
            <path d="M51.9209 16.5607L51.9209 7.71429L42.788 7.71429L42.788 16.5607L51.9209 16.5607Z" fill="black" />
            <path d="M42.79 25.4065L42.79 16.5601L33.6572 16.5601L33.6572 25.4065L42.79 25.4065Z" fill="black" />
            <path d="M51.9209 34.2547L51.9209 25.4083L42.788 25.4083L42.788 34.2547L51.9209 34.2547Z" fill="black" />
            <path d="M33.6562 16.5607L33.6562 7.71429L24.5234 7.71429L24.5234 16.5607L33.6562 16.5607Z" fill="black" />
            <path d="M33.6562 34.2546L33.6562 25.4082L24.5234 25.4082L24.5234 34.2546L33.6562 34.2546Z" fill="black" />
        </svg>
    );

    return (
        <div className="overflow-y-auto px-6 pt-6 max-h-[520px]">
            <div className="max-w-3xl mx-auto w-full space-y-6 pb-6">
                {/* Greeting */}
                <div className="flex flex-col items-start">
                    <div className="flex gap-4 max-w-[90%]">
                        <div className="h-9 w-9 rounded-full border shadow-sm shrink-0 flex items-center justify-center overflow-hidden bg-[#FFE501] border-primary/20"><TenexLogo /></div>
                        <div className="space-y-2">
                            <div className="px-4 py-3 rounded-2xl text-sm font-medium shadow-sm leading-relaxed bg-background border rounded-tl-none">Good afternoon, Jawad. I&apos;m connected to your calendar and ready.</div>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-1 opacity-60">Just now</span>
                        </div>
                    </div>
                </div>
                {/* User message */}
                <div className="flex flex-col items-end">
                    <div className="flex gap-4 max-w-[90%] flex-row-reverse">
                        <div className="h-9 w-9 rounded-full border shadow-sm shrink-0 flex items-center justify-center bg-accent border-background"><span className="text-xs font-bold">JS</span></div>
                        <div className="space-y-2">
                            <div className="px-4 py-3 rounded-2xl text-sm font-medium shadow-sm leading-relaxed bg-primary text-primary-foreground rounded-tr-none">Summarize my week for me</div>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-1 opacity-60">Just now</span>
                        </div>
                    </div>
                </div>
                {/* AI response with tool status + StatsGrid + citations */}
                <div className="flex flex-col items-start">
                    <div className="flex gap-4 max-w-[90%]">
                        <div className="h-9 w-9 rounded-full border shadow-sm shrink-0 flex items-center justify-center overflow-hidden bg-[#FFE501] border-primary/20"><TenexLogo /></div>
                        <div className="space-y-2 max-w-full overflow-hidden">
                            {/* Tool status */}
                            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/5 border border-emerald-500/15 text-emerald-600 w-fit">
                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                Calendar data loaded
                            </div>
                            <div className="px-4 py-3 rounded-2xl text-sm font-medium shadow-sm leading-relaxed bg-background border rounded-tl-none text-foreground">
                                <p>Here&apos;s your weekly summary:</p>
                                <p className="mt-1">• <strong>8 meetings</strong> totaling 6.2 hours</p>
                                <p className="mt-1">• <strong>Busiest day:</strong> Monday with 3 back-to-back calls</p>
                                <p className="mt-1">• <strong>Focus time:</strong> ~33.8 hours available</p>
                                <p className="mt-1">• <strong>Key events:</strong> <CitationBtn name="Design Review" /> <CitationBtn name="Sprint Planning" /> <CitationBtn name="1:1 with Manager" /></p>
                                <MiniStatsGrid />
                            </div>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-1 opacity-60">Just now</span>
                        </div>
                    </div>
                </div>
                {/* Typing indicator */}
                <div className="flex items-start gap-4">
                    <div className="h-9 w-9 rounded-full border shadow-sm shrink-0 bg-[#FFE501] border-primary/20 flex items-center justify-center overflow-hidden"><TenexLogo /></div>
                    <div className="bg-background border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                        <div className="flex gap-1 items-center h-4">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   11. ChatInputForm Shell — standalone typable input with quick actions
   ═══════════════════════════════════════════════════════════════════ */
export function ShellChatInputForm() {
    const [input, setInput] = useState("");
    const actions = [
        { label: "Draft email", prompt: "Draft a professional email to the team about upcoming sprint planning changes and new priorities for Q2." },
        { label: "Reschedule sync", prompt: "I need to reschedule my 1:1 with Manager from today at 3:30 PM to Thursday at the same time." },
        { label: "Summarize week", prompt: "Summarize my calendar for this week — how many meetings, focus time, and key themes." },
        { label: "Audit meetings", prompt: "Audit my meetings for this week. Which ones could be emails? Any conflicts or back-to-backs?" },
    ];

    return (
        <div className="w-full max-w-3xl">
            <div className="w-full bg-background border border-border/60 rounded-2xl shadow-xl p-2 flex flex-col gap-1">
                <div className="flex items-center gap-2 px-3">
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask Tenex Intelligence anything..."
                        className="flex-1 border-none shadow-none bg-transparent font-medium min-h-[44px] max-h-[200px] resize-none py-3 px-0 m-0 focus:outline-none text-sm"
                        rows={1}
                    />
                    <button className={`h-9 w-9 p-0 rounded-xl bg-primary shadow-md shadow-primary/20 flex items-center justify-center transition-all ${!input.trim() ? "opacity-30 cursor-not-allowed" : "hover:scale-105"}`}>
                        <ArrowRight className="h-4 w-4 text-primary-foreground rotate-[-90deg]" />
                    </button>
                </div>
                <div className="flex items-center justify-between px-2 pb-0.5">
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1">
                        {actions.map(a => (
                            <button key={a.label} onClick={() => setInput(a.prompt)} className="flex items-center gap-1.5 text-[10px] whitespace-nowrap px-2.5 py-1.5 rounded-full font-bold text-muted-foreground border border-transparent bg-accent/50 cursor-pointer hover:bg-muted transition-all">
                                {a.label}
                            </button>
                        ))}
                    </div>
                    <p className="hidden sm:block text-[9px] text-muted-foreground font-bold tracking-widest uppercase opacity-40 shrink-0 pl-2">Tenex AI v1.0</p>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   12. MessageRenderer Shell — demonstrates citation + widget rendering
   ═══════════════════════════════════════════════════════════════════ */
export function ShellMessageRenderer() {
    return (
        <div className="w-full max-w-lg space-y-4">
            {/* Tool status */}
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/5 border border-emerald-500/15 text-emerald-600 w-fit">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Calendar data loaded
            </div>
            {/* Markdown body with citations */}
            <div className="prose prose-sm">
                <p className="leading-relaxed text-sm">You have <strong>3 meetings</strong> today:</p>
                <p className="leading-relaxed text-sm mt-1">• <strong>10:00 AM</strong> — <CitationBtn name="Design Review" /> (Video Call)</p>
                <p className="leading-relaxed text-sm mt-1">• <strong>1:00 PM</strong> — <CitationBtn name="Sprint Planning" /> (Conference Room A)</p>
                <p className="leading-relaxed text-sm mt-1">• <strong>3:30 PM</strong> — <CitationBtn name="1:1 with Manager" /> (Video Call)</p>
                <p className="leading-relaxed text-sm mt-2">These <CitationBtn name="Design Review" /> and <CitationBtn name="Sprint Planning" /> are back-to-back. I&apos;d recommend a 15-minute buffer.</p>
            </div>
            {/* Inline stats */}
            <MiniStatsGrid />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   13. SchedulePanel Shell — day view with grouped events
   ═══════════════════════════════════════════════════════════════════ */
export function ShellSchedulePanel() {
    const [viewAll, setViewAll] = useState(false);

    const todayEvents = [
        { name: "Design Review", time: "10:00 AM", hasVideo: true, status: "soon", statusLabel: "In 30m", color: "bg-blue-500" },
        { name: "Sprint Planning", time: "1:00 PM", hasVideo: false, status: "upcoming", statusLabel: "In 3h", color: "bg-violet-500" },
    ];

    const tomorrowEvents = [
        { name: "Product Sync", time: "11:00 AM", hasVideo: true, status: "upcoming", statusLabel: "Tomorrow", color: "bg-emerald-500" },
    ];

    return (
        <div className="w-full max-w-[300px]">
            <div className="flex items-center justify-between px-2 mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{viewAll ? "This Week & Beyond" : "Today"}</p>
                <button onClick={() => setViewAll(!viewAll)} className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${viewAll ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
                    {viewAll ? "By Day" : "View All"}
                </button>
            </div>
            <div className="space-y-4">
                <div>
                    <div className="flex items-center gap-2 px-1 mb-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary">Today</p>
                        <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        {todayEvents.map((event) => (
                            <div key={event.name} className="group transition-all rounded-2xl p-3 border border-transparent hover:border-border/50 cursor-pointer relative hover:bg-accent/40">
                                <div className={`absolute left-0 top-4 w-1 h-8 rounded-full ${event.color}`} />
                                <div className="flex flex-col gap-1 pl-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="text-xs font-bold leading-tight truncate flex-1 group-hover:text-primary transition-colors">{event.name}</h4>
                                        <span className={`inline-flex items-center h-4 text-[8px] rounded-full px-1.5 shrink-0 font-bold ${event.status === "soon" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{event.statusLabel}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                                        <Clock className="h-3 w-3 shrink-0" /><span>{event.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {viewAll && (
                    <div>
                        <div className="flex items-center gap-2 px-1 mb-2"><p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Tomorrow</p></div>
                        <div className="space-y-2">
                            {tomorrowEvents.map((event) => (
                                <div key={event.name} className="group transition-all rounded-2xl p-3 border border-transparent hover:border-border/50 cursor-pointer relative hover:bg-accent/40">
                                    <div className={`absolute left-0 top-4 w-1 h-8 rounded-full ${event.color}`} />
                                    <div className="flex flex-col gap-1 pl-3">
                                        <h4 className="text-xs font-bold leading-tight truncate group-hover:text-primary transition-colors">{event.name}</h4>
                                        <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground"><Clock className="h-3 w-3 shrink-0" /><span>{event.time}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
