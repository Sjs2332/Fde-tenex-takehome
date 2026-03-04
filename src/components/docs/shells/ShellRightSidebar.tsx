"use client";

import { useState } from "react";
import {
    Calendar as LucideCalendar, HelpCircle, Clock, Video, MapPin, ArrowRight, X,
    Users, AlignLeft, ExternalLink, CheckCircle2, Loader2, Check,
} from "lucide-react";

/* ── Event Detail Inline Modal ── */
function EventDetailPopup({ event, onClose }: { event: { name: string; time: string; date: string; hasVideo: boolean; attendees: string[]; description: string }; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-[520px] mx-4 bg-background/95 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="bg-primary/5 px-6 pt-6 pb-5 border-b border-primary/10">
                    <div className="flex items-start justify-between gap-3">
                        <div className="bg-primary/10 w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5">
                            <LucideCalendar className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-black tracking-tight leading-snug">{event.name}</h3>
                            <div className="mt-2">
                                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">Soon</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div className="px-6 py-5 space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0"><Clock className="h-4 w-4 text-muted-foreground" /></div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Date & Time</p>
                            <p className="text-sm font-semibold">{event.date}</p>
                            <p className="text-sm text-muted-foreground font-medium">{event.time}</p>
                        </div>
                    </div>
                    <div className="border-t border-border/30" />
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0">{event.hasVideo ? <Video className="h-4 w-4 text-blue-500" /> : <MapPin className="h-4 w-4 text-muted-foreground" />}</div>
                        <div className="space-y-1 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{event.hasVideo ? "Video Call" : "Location"}</p>
                            {event.hasVideo ? (
                                <button className="rounded-xl h-8 text-xs font-bold gap-2 border border-blue-500/30 text-blue-500 hover:bg-blue-500/10 px-3 flex items-center transition-colors">
                                    <Video className="h-3 w-3" /> Join Google Meet <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
                                </button>
                            ) : (
                                <p className="text-sm font-medium">Conference Room A</p>
                            )}
                        </div>
                    </div>
                    <div className="border-t border-border/30" />
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0"><Users className="h-4 w-4 text-muted-foreground" /></div>
                        <div className="space-y-2 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Guests ({event.attendees.length})</p>
                            <div className="space-y-2">
                                {event.attendees.map(a => (
                                    <div key={a} className="flex items-center gap-2.5">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary shrink-0">{a.split(" ").map(n => n[0]).join("")}</div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold leading-tight">{a}</p>
                                            <p className="text-[10px] text-muted-foreground">{a.toLowerCase().replace(" ", ".")}@tenex.ai</p>
                                        </div>
                                        <span className="ml-auto text-[9px] font-bold uppercase tracking-wide text-emerald-500">accepted</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-border/30" />
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0"><AlignLeft className="h-4 w-4 text-muted-foreground" /></div>
                        <div className="space-y-1 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Description</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Create Event Inline Modal ── */
function CreateEventPopup({ onClose }: { onClose: () => void }) {
    const [title, setTitle] = useState("Quarterly Strategy Sync");
    const [isMeet, setIsMeet] = useState(true);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-[800px] mx-4 bg-background/95 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="bg-primary/5 px-8 py-8 border-b border-primary/10">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center"><LucideCalendar className="h-6 w-6 text-primary" /></div>
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
                                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full h-12 rounded-xl border border-border/50 bg-background/50 px-3 font-medium focus:outline-none focus:ring-1 focus:ring-primary/50" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">Start</label>
                                    <input type="datetime-local" defaultValue="2026-03-10T10:00" className="w-full h-12 rounded-xl border border-border/50 bg-background/50 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">End</label>
                                    <input type="datetime-local" defaultValue="2026-03-10T11:00" className="w-full h-12 rounded-xl border border-border/50 bg-background/50 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/20 p-2 rounded-lg text-primary"><Video className="h-4 w-4" /></div>
                                    <div><span className="text-sm font-bold block">Google Meet</span><span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Add video link</span></div>
                                </div>
                                <button onClick={() => setIsMeet(!isMeet)} className={`relative w-10 h-6 rounded-full transition-colors ${isMeet ? "bg-primary" : "bg-muted"}`}>
                                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isMeet ? "left-5" : "left-1"}`} />
                                </button>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2"><Users className="h-3 w-3" /> Guests</label>
                                <input defaultValue="team@tenex.ai, design@tenex.ai" className="w-full h-12 rounded-xl border border-border/50 bg-background/50 px-3 focus:outline-none focus:ring-1 focus:ring-primary/50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2"><AlignLeft className="h-3 w-3" /> Description</label>
                                <textarea defaultValue="Review Q1 metrics and align on Q2 goals." className="w-full min-h-[148px] rounded-xl border border-border/50 bg-background/50 px-3 py-3 resize-none text-sm focus:outline-none focus:ring-1 focus:ring-primary/50" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-8 py-6 bg-muted/30 border-t flex items-center justify-end gap-3">
                    <button onClick={onClose} className="rounded-xl font-bold text-xs uppercase tracking-widest h-12 px-6 hover:bg-muted transition-colors">Cancel</button>
                    <button className="rounded-xl font-bold text-xs uppercase tracking-widest bg-primary text-primary-foreground h-12 px-8 flex items-center gap-2 opacity-60 cursor-not-allowed" title="Disabled in demo">
                        <LucideCalendar className="h-4 w-4" /> Create Event
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Main RightSidebar Shell ── */
export function ShellRightSidebar() {
    const [showHelp, setShowHelp] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [detailEvent, setDetailEvent] = useState<null | typeof mockEvents[0]>(null);

    const today = new Date();
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    return (
        <>
            <div className="h-full border-l bg-sidebar/50 backdrop-blur-xl flex flex-col w-[280px]">
                {/* Header */}
                <div className="border-b h-16 flex items-center px-4 shrink-0">
                    <div className="flex items-center justify-end gap-2 w-full relative">
                        <button onClick={() => setShowHelp(!showHelp)} className="rounded-xl h-10 w-10 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors">
                            <HelpCircle className="h-5 w-5" />
                        </button>
                        {/* Help Popup */}
                        {showHelp && (
                            <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-border/60 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">How to use Tenex</h4>
                                    <button onClick={() => setShowHelp(false)} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
                                </div>
                                <div className="p-4 space-y-3 text-xs text-muted-foreground">
                                    <div className="space-y-1"><p className="font-bold text-foreground">💬 Ask AI anything</p><p>Type natural language questions about your calendar, schedule meetings, or reschedule events.</p></div>
                                    <div className="space-y-1"><p className="font-bold text-foreground">⚡ Quick Actions</p><p>Use the chips below the input to draft emails, summarize your week, audit meetings, or reschedule.</p></div>
                                    <div className="space-y-1"><p className="font-bold text-foreground">📅 Calendar</p><p>Click any day on the calendar to filter events. Click &quot;View All&quot; to see everything.</p></div>
                                    <div className="space-y-1"><p className="font-bold text-foreground">🔍 Search</p><p>Use the search bar in the header to quickly find events by name.</p></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mini Calendar */}
                <div className="shrink-0 px-3 pt-4 pb-0">
                    <p className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">Schedule Overview</p>
                    <div className="flex justify-center">
                        <div className="rounded-xl bg-transparent scale-90 origin-top w-full">
                            <div className="text-center mb-2"><p className="text-sm font-bold">{today.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p></div>
                            <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                                {daysOfWeek.map(d => (<div key={d} className="font-bold text-muted-foreground/50 py-1">{d}</div>))}
                                {Array.from({ length: 35 }, (_, i) => {
                                    const startDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
                                    const dayNum = i - startDay + 1;
                                    const maxDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                                    const isValid = dayNum >= 1 && dayNum <= maxDay;
                                    const isToday = dayNum === today.getDate();
                                    return (<div key={i} className={`py-1 rounded-md text-xs font-medium ${isToday ? "bg-primary text-primary-foreground font-bold" : isValid ? "text-foreground hover:bg-muted cursor-pointer" : "text-transparent"}`}>{isValid ? dayNum : ""}</div>);
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event Cards */}
                <div className="flex flex-col min-h-0 flex-1 px-3 pb-4">
                    <div className="flex items-center justify-between px-2 mb-3 shrink-0 mt-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Today</p>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary cursor-pointer">View All</span>
                    </div>
                    <div className="overflow-y-auto scrollbar-none flex-1 space-y-2">
                        {mockEvents.map(event => (
                            <div
                                key={event.name}
                                onClick={() => setDetailEvent(event)}
                                className="group transition-all rounded-2xl p-3 border border-transparent hover:border-border/50 cursor-pointer relative hover:bg-accent/40"
                            >
                                <div className={`absolute left-0 top-4 w-1 h-8 rounded-full ${event.color}`} />
                                <div className="flex flex-col gap-1.5 pl-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="text-xs font-bold leading-tight truncate flex-1 group-hover:text-primary transition-colors">{event.name}</h4>
                                        <span className={`inline-flex items-center h-4 text-[8px] rounded-full px-1.5 shrink-0 whitespace-nowrap font-bold ${event.status === "soon" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{event.statusLabel}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground"><Clock className="h-3 w-3 shrink-0" /><span>{event.time}</span></div>
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
                                        {event.hasVideo ? <Video className="h-3 w-3 text-blue-500 shrink-0" /> : <MapPin className="h-3 w-3 shrink-0" />}
                                        <span className="truncate">{event.hasVideo ? "Video Call" : "Conference Room A"}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-0.5">
                                        <div className="flex -space-x-1.5">
                                            {event.attendees.map(a => (<div key={a} className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[7px] font-bold border-2 border-background">{a}</div>))}
                                        </div>
                                        <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t p-4 shrink-0">
                    <button onClick={() => setShowCreateModal(true)} className="w-full rounded-xl font-bold text-[11px] h-12 shadow-lg shadow-primary/20 bg-primary text-primary-foreground flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        <LucideCalendar className="h-4 w-4" /> Schedule New
                    </button>
                </div>
            </div>

            {/* Modals */}
            {detailEvent && (
                <EventDetailPopup
                    event={{
                        name: detailEvent.name,
                        time: detailEvent.time,
                        date: "Monday, March 10, 2026",
                        hasVideo: detailEvent.hasVideo,
                        attendees: detailEvent.attendees.map(a => `${a} User`),
                        description: `Weekly sync to review progress on ${detailEvent.name.toLowerCase()} and discuss upcoming priorities.`,
                    }}
                    onClose={() => setDetailEvent(null)}
                />
            )}
            {showCreateModal && <CreateEventPopup onClose={() => setShowCreateModal(false)} />}
        </>
    );
}

const mockEvents = [
    { name: "Design Review", time: "10:00 AM", hasVideo: true, status: "soon" as const, statusLabel: "In 30m", attendees: ["AJ", "KM"], color: "bg-blue-500" },
    { name: "Sprint Planning", time: "1:00 PM", hasVideo: false, status: "upcoming" as const, statusLabel: "In 3h", attendees: ["SJ", "RL", "DW"], color: "bg-violet-500" },
    { name: "1:1 with Manager", time: "3:30 PM", hasVideo: true, status: "upcoming" as const, statusLabel: "In 5h 30m", attendees: ["PM"], color: "bg-emerald-500" },
];
