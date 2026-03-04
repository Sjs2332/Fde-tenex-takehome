"use client";

import { useState, useRef, useEffect } from "react";
import {
    ArrowUp, Loader2, Mail, RefreshCw, BarChart3, ClipboardCheck,
    Video, Clock, CheckCircle2, TrendingUp, Sparkles, ArrowRight,
    X, MapPin, Users, Calendar, ExternalLink,
} from "lucide-react";

/* ── Tenex Logo SVG ── */
function TenexLogo() {
    return (
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
}

/* ── Inline StatsGrid ── */
function InlineStatsGrid() {
    const stats = [
        { label: "Meetings", value: "6.2h", delta: "8 events", icon: Video, color: "text-blue-500", bg: "bg-blue-500/10", trend: "up" },
        { label: "Focus Time", value: "33.8h", delta: "available", icon: Clock, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "up" },
        { label: "Completed", value: "62%", delta: "5/8", icon: CheckCircle2, color: "text-violet-500", bg: "bg-violet-500/10", trend: "up" },
    ];

    return (
        <div className="grid grid-cols-3 gap-3 w-full mt-2">
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <div key={i} className="bg-background border rounded-2xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer">
                        <div className={`p-1.5 w-fit rounded-lg mb-2 ${stat.bg}`}><Icon className={`h-4 w-4 ${stat.color}`} /></div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-black">{stat.value}</span>
                            <span className="text-[9px] font-bold flex items-center gap-0.5 text-emerald-500"><TrendingUp className="h-2.5 w-2.5" />{stat.delta}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/* ── Inline ScheduleCard ── */
function InlineScheduleCard() {
    const upcoming = [
        { name: "Design Review", time: "Today 10:00 AM", hasVideo: true, until: "In 30m" },
        { name: "Sprint Planning", time: "Today 1:00 PM", hasVideo: false, until: "In 3h" },
        { name: "1:1 with Manager", time: "Today 3:30 PM", hasVideo: true, until: "In 5h" },
    ];

    return (
        <div className="w-full border-none shadow-sm bg-background overflow-hidden rounded-2xl mt-2">
            <div className="p-3 pb-1.5 bg-muted/20 border-b">
                <h3 className="text-xs font-bold flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-primary" />Upcoming Schedule</h3>
            </div>
            {upcoming.map((event, i) => (
                <div key={i} className="flex items-center gap-3 p-3 px-4 border-b last:border-0 relative">
                    <div className="w-1 h-6 rounded-full absolute left-0 bg-primary" />
                    <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold truncate">{event.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{event.time}</span>
                            {event.hasVideo && <span className="flex items-center gap-0.5 text-blue-500"><Video className="h-3 w-3" /> Meet</span>}
                        </div>
                    </div>
                    <span className="text-[9px] h-4 px-1 border border-primary/20 text-primary shrink-0 rounded-full flex items-center font-bold">{event.until}</span>
                </div>
            ))}
        </div>
    );
}

/* ── Mock event data for citations ── */
const CITATION_EVENTS: Record<string, { time: string; hasVideo: boolean; attendees: string[] }> = {
    "Design Review": { time: "10:00 AM – 11:00 AM", hasVideo: true, attendees: ["Alice Johnson", "Kyle Martinez"] },
    "Sprint Planning": { time: "1:00 PM – 2:30 PM", hasVideo: false, attendees: ["Sarah Jones", "Ryan Lee", "Diana Wu"] },
    "1:1 with Manager": { time: "3:30 PM – 4:00 PM", hasVideo: true, attendees: ["Pat Morgan"] },
};

/* ── Citation button with popup ── */
function Citation({ name }: { name: string }) {
    const [open, setOpen] = useState(false);
    const event = CITATION_EVENTS[name];

    return (
        <span className="relative inline-block">
            <button
                onClick={() => setOpen(!open)}
                className="px-1.5 py-0.5 rounded-md text-[11px] font-bold transition-all mx-0.5 inline bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
            >
                {name}
            </button>
            {open && event && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-card border border-border/60 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-primary/5">
                        <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-sm font-bold">{name}</span>
                        </span>
                        <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 opacity-60" />
                            <span className="font-medium">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {event.hasVideo ? <Video className="h-3.5 w-3.5 text-blue-500" /> : <MapPin className="h-3.5 w-3.5 opacity-60" />}
                            <span className="font-medium">{event.hasVideo ? "Google Meet" : "Conference Room A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="h-3.5 w-3.5 opacity-60" />
                            <span className="font-medium">{event.attendees.join(", ")}</span>
                        </div>
                        <button className="w-full mt-1 rounded-lg h-7 text-[10px] font-bold text-muted-foreground hover:text-foreground border border-border/50 hover:bg-accent/60 flex items-center justify-center gap-1.5 transition-colors">
                            <ExternalLink className="h-3 w-3" /> Open in Calendar
                        </button>
                    </div>
                </div>
            )}
        </span>
    );
}

/* ── Quick actions config ── */
const QUICK_ACTIONS = [
    { label: "Draft email", icon: Mail, prompt: "Draft a professional email to the team about upcoming sprint planning changes and new priorities for Q2." },
    { label: "Reschedule sync", icon: RefreshCw, prompt: "I need to reschedule my 1:1 with Manager from today at 3:30 PM to Thursday at the same time." },
    { label: "Summarize week", icon: BarChart3, prompt: "Summarize my calendar for this week — how many meetings, focus time, and key themes." },
    { label: "Audit meetings", icon: ClipboardCheck, prompt: "Audit my meetings for this week. Which ones could be emails? Any conflicts or back-to-backs?" },
];

/* ── Message type ── */
interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    showStats?: boolean;
    showSchedule?: boolean;
    citations?: string[];
}

/* ── Initial conversation ── */
const INITIAL_MESSAGES: ChatMessage[] = [
    {
        id: "1",
        role: "assistant",
        content: "Good afternoon, Jawad. I'm connected to your Google Calendar and ready to help. Use the quick actions below or ask me anything about your schedule.",
    },
    {
        id: "2",
        role: "user",
        content: "What meetings do I have today?",
    },
    {
        id: "3",
        role: "assistant",
        content: "You have 3 meetings today:\n\n• **10:00 AM** — [[Design Review]] (Video Call)\n• **1:00 PM** — [[Sprint Planning]] (Conference Room A)\n• **3:30 PM** — [[1:1 with Manager]] (Video Call)\n\nYou have about **4.5 hours** of focus time between meetings. Would you like me to schedule a focus block?",
        showStats: true,
        showSchedule: true,
        citations: ["Design Review", "Sprint Planning", "1:1 with Manager"],
    },
];

/* ═══════════════════════════════════════════════════════════════════
   Main ShellChatInterface
   ═══════════════════════════════════════════════════════════════════ */
export function ShellChatInterface() {
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        // Simulate AI response after a short delay
        setTimeout(() => {
            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I've noted your request. In the live app, this would trigger the AI SDK to process your message with access to your Google Calendar tools (get_events, create_event, delete_event) and respond with real data.\n\nThis is a demo shell — try the quick actions below to see more examples!",
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 800);
    };

    const handleQuickAction = (prompt: string) => {
        setInput(prompt);
    };

    /* ── Render message text with bold and citations ── */
    const renderContent = (msg: ChatMessage) => {
        const lines = msg.content.split("\n");
        return lines.map((line, i) => {
            // Parse bold and citations
            const segments = line.split(/(\*\*.*?\*\*|\[\[.*?\]\])/g);
            return (
                <div key={i} className={`${i > 0 ? "mt-1" : ""}`}>
                    {segments.map((seg, j) => {
                        if (seg.startsWith("**") && seg.endsWith("**")) {
                            return <strong key={j}>{seg.slice(2, -2)}</strong>;
                        }
                        if (seg.startsWith("[[") && seg.endsWith("]]")) {
                            return <Citation key={j} name={seg.slice(2, -2)} />;
                        }
                        return <span key={j}>{seg}</span>;
                    })}
                </div>
            );
        });
    };

    return (
        <div className="flex flex-col h-full bg-muted/30">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto overscroll-none px-6 pt-8 scrollbar-none">
                <div className="max-w-3xl mx-auto w-full space-y-8 pb-6">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                            <div className={`flex gap-4 max-w-[90%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                <div className={`h-9 w-9 rounded-full border shadow-sm shrink-0 flex items-center justify-center overflow-hidden ${msg.role === "assistant" ? "bg-[#FFE501] border-primary/20" : "bg-accent border-background"}`}>
                                    {msg.role === "assistant" ? <TenexLogo /> : <span className="text-xs font-bold">JS</span>}
                                </div>
                                <div className="space-y-2 max-w-full overflow-hidden">
                                    {/* Tool status pills for the response with widgets */}
                                    {msg.showStats && (
                                        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/5 border border-emerald-500/15 text-emerald-600 w-fit">
                                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            Calendar data loaded
                                        </div>
                                    )}
                                    <div className={`px-4 py-3 rounded-2xl text-sm font-medium shadow-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-background border rounded-tl-none text-foreground break-words max-w-full"}`}>
                                        {renderContent(msg)}
                                        {msg.showStats && <InlineStatsGrid />}
                                        {msg.showSchedule && <InlineScheduleCard />}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-1 opacity-60">Just now</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Bar */}
            <div className="p-4">
                <div className="max-w-3xl mx-auto">
                    <div className="w-full bg-background border border-border/60 rounded-2xl shadow-xl p-2 flex flex-col gap-1">
                        <div className="flex items-center gap-2 px-3">
                            <textarea
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                                placeholder="Ask Tenex Intelligence anything..."
                                className="flex-1 border-none shadow-none bg-transparent font-medium min-h-[44px] max-h-[200px] resize-none py-3 px-0 m-0 focus:outline-none text-sm"
                                rows={1}
                            />
                            <div className="flex h-11 items-center mb-0.5">
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className={`h-9 w-9 p-0 rounded-xl bg-primary shadow-md shadow-primary/20 flex items-center justify-center transition-all ${!input.trim() ? "opacity-30 cursor-not-allowed" : "hover:scale-105 active:scale-95"}`}
                                >
                                    <ArrowUp className="h-4 w-4 text-primary-foreground" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between px-2 pb-0.5">
                            <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1">
                                {QUICK_ACTIONS.map(action => {
                                    const Icon = action.icon;
                                    return (
                                        <button
                                            key={action.label}
                                            onClick={() => handleQuickAction(action.prompt)}
                                            className="flex items-center gap-1.5 text-[10px] whitespace-nowrap px-2.5 py-1.5 rounded-full font-bold text-muted-foreground border border-transparent bg-accent/50 cursor-pointer hover:bg-muted transition-all"
                                        >
                                            <Icon className="h-2.5 w-2.5" />
                                            {action.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="hidden sm:block text-[9px] text-muted-foreground font-bold tracking-widest uppercase opacity-40 shrink-0 pl-2">Tenex AI v1.0</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
