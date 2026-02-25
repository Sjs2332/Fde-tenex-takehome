import { GoogleCalendarEvent } from "@/types/google/calendar";
import { parseISO } from "date-fns";

type EventStatus = "done" | "in-progress" | "soon" | "upcoming";

export const EVENT_COLORS = [
    "bg-blue-500",
    "bg-violet-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
];

/**
 * Derives initials from a Google account email address.
 * e.g. "john.doe@gmail.com" → "JD"
 */
export function getInitials(email: string): string {
    const name = email.split("@")[0];
    const parts = name.split(/[._-]/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
}

/**
 * Classifies an event's current temporal status.
 * - done:        event has ended
 * - in-progress: currently happening (now is between start and end)
 * - soon:        starts within the next 60 minutes
 * - upcoming:    starts more than 60 minutes from now
 */
export function getEventStatus(event: GoogleCalendarEvent): EventStatus {
    if (!event.start?.dateTime) return "upcoming";
    const start = parseISO(event.start.dateTime);
    const end = event.end?.dateTime ? parseISO(event.end.dateTime) : start;
    const now = new Date();
    if (now >= start && now <= end) return "in-progress";
    if (end < now) return "done";
    const diffMins = (start.getTime() - now.getTime()) / 60000;
    if (diffMins >= 0 && diffMins <= 60) return "soon";
    return "upcoming";
}

/**
 * Returns a human-readable "time until" string for any future event.
 * - < 60 min  → "in 23 min"
 * - ≤ 20 hrs  → "in 4 hr"
 * - > 20 hrs  → "in 2 days"
 * Returns null for past or in-progress events.
 */
export function getTimeUntilLabel(event: GoogleCalendarEvent): string | null {
    if (!event.start?.dateTime) return null;
    const start = parseISO(event.start.dateTime);
    const diffMs = start.getTime() - Date.now();
    if (diffMs <= 0) return null;
    const diffMins = Math.round(diffMs / 60000);
    const diffHrs = diffMs / 3600000;
    const diffDays = Math.round(diffMs / 86400000);
    if (diffMins < 60) return `in ${diffMins} min`;
    if (diffHrs <= 20) return `in ${Math.round(diffHrs)} hr`;
    return `in ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
}
