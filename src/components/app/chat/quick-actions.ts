import { Mail, RefreshCcw, BarChart3, ClipboardList } from "lucide-react";
import { GoogleCalendarEvent } from "@/types/google/calendar";

export interface QuickAction {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    buildPrompt: (events: GoogleCalendarEvent[]) => string;
}

/**
 * Quick Action chips shown in the chat input bar.
 * Each action generates a contextual prompt based on the user's live calendar data.
 *
 * NOTE: Widget markers ([WIDGET: STATS] etc.) are NOT included in these prompts.
 * The AI automatically appends them based on the system prompt instructions.
 */
export const QUICK_ACTIONS: QuickAction[] = [
    {
        label: "Draft email",
        icon: Mail,
        color: "hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/20",
        buildPrompt: () =>
            "I need to draft an email. Ask me who it's for and what it's about.",
    },
    {
        label: "Reschedule sync",
        icon: RefreshCcw,
        color: "hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/20",
        buildPrompt: (events) => {
            const now = new Date();
            const next = events.find(e => e.start?.dateTime && new Date(e.start.dateTime) > now);
            if (!next) return "I don't have any upcoming meetings to reschedule.";
            const time = next.start?.dateTime
                ? new Date(next.start.dateTime).toLocaleString("en-US", { weekday: "long", hour: "numeric", minute: "2-digit" })
                : "soon";
            return `Reschedule "${next.summary}" currently at ${time} to tomorrow at the same time. Delete the old event and create a new one. Then draft a brief email to attendees about the change.`;
        },
    },
    {
        label: "Summarize week",
        icon: BarChart3,
        color: "hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20",
        buildPrompt: () =>
            "Give me a summary of my week. Include total meeting hours, key themes, busiest day, and any observations.",
    },
    {
        label: "Audit meetings",
        icon: ClipboardList,
        color: "hover:bg-violet-500/10 hover:text-violet-500 hover:border-violet-500/20",
        buildPrompt: () =>
            "Audit my meetings this week. For each meeting, assess whether it could be shortened, replaced with an async update, or cancelled. Give me a ranked list.",
    },
];
