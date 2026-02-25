import { z } from "zod";
import { tool } from "ai";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface CalendarEventResult {
    id: string;
    summary: string;
    start: string;
    end: string;
    attendees: string[];
    location: string | null;
    hasVideoCall: boolean;
}

// ─── Tool Definitions ──────────────────────────────────────────────────────────

/**
 * Returns all AI agent tools that interact with Google Calendar.
 * Token is captured in the closure — tools never expose it to the LLM.
 */
export function createCalendarTools(token: string | null) {
    return {
        get_events: tool({
            description:
                "Fetch the user's Google Calendar events for a specific time range. Returns event IDs needed for deletion/rescheduling.",
            inputSchema: z.object({
                timeMin: z.string().describe("ISO 8601 start of range, e.g. 2026-02-24T00:00:00-05:00"),
                timeMax: z.string().describe("ISO 8601 end of range, e.g. 2026-02-25T00:00:00-05:00"),
            }),
            execute: async ({ timeMin, timeMax }) => {
                assertToken(token);

                const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
                    `timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}` +
                    `&singleEvents=true&orderBy=startTime&maxResults=50`;

                const data = await googleApiFetch<{ items?: any[] }>(url, token!);

                const events: CalendarEventResult[] = (data.items || []).map((e: any) => ({
                    id: e.id,
                    summary: e.summary || "(No title)",
                    start: e.start?.dateTime || e.start?.date,
                    end: e.end?.dateTime || e.end?.date,
                    attendees: (e.attendees || []).map((a: any) => a.email),
                    location: e.location || null,
                    hasVideoCall: !!e.conferenceData,
                }));

                return events.length > 0
                    ? { count: events.length, events }
                    : { count: 0, events: [], message: "No events found in this time range." };
            },
        }),

        create_event: tool({
            description:
                "Create a new event on the user's Google Calendar with optional Google Meet link and attendees.",
            inputSchema: z.object({
                summary: z.string().describe("Title of the event"),
                startDateTime: z.string().describe("ISO 8601 start datetime"),
                endDateTime: z.string().describe("ISO 8601 end datetime"),
                description: z.string().optional().describe("Optional description/agenda"),
                location: z.string().optional().describe("Optional location"),
                attendees: z.array(z.string()).optional().describe("Optional attendee email addresses"),
            }),
            execute: async ({ summary, startDateTime, endDateTime, description, location, attendees }) => {
                assertToken(token);

                const eventBody: Record<string, any> = {
                    summary,
                    start: { dateTime: startDateTime },
                    end: { dateTime: endDateTime },
                    conferenceData: {
                        createRequest: {
                            requestId: `tenex-${Date.now()}`,
                            conferenceSolutionKey: { type: "hangoutsMeet" },
                        },
                    },
                };

                if (description) eventBody.description = description;
                if (location) eventBody.location = location;
                if (attendees?.length) {
                    eventBody.attendees = attendees.map((email) => ({ email }));
                }

                const created = await googleApiFetch<any>(
                    "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
                    token!,
                    { method: "POST", body: JSON.stringify(eventBody) }
                );

                return {
                    success: true,
                    event: {
                        summary: created.summary,
                        start: created.start?.dateTime || created.start?.date,
                        end: created.end?.dateTime || created.end?.date,
                        meetLink: created.conferenceData?.entryPoints?.[0]?.uri || null,
                        htmlLink: created.htmlLink,
                    },
                };
            },
        }),

        delete_event: tool({
            description:
                "Delete/cancel an event from the user's Google Calendar. Used for rescheduling (delete old + create new) or cancellation.",
            inputSchema: z.object({
                eventId: z.string().describe("Google Calendar event ID from a prior get_events call"),
                summary: z.string().optional().describe("Event title for the confirmation message"),
            }),
            execute: async ({ eventId, summary }) => {
                assertToken(token);

                await googleApiFetch(
                    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`,
                    token!,
                    { method: "DELETE" }
                );

                return {
                    success: true,
                    message: `Event "${summary || eventId}" has been removed from the calendar.`,
                };
            },
        }),
    };
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function assertToken(token: string | null): asserts token is string {
    if (!token) {
        throw new Error("No Google access token. User must log in first.");
    }
}

const MAX_RETRIES = 2;
const RETRY_DELAYS_MS = [500, 1500];

async function googleApiFetch<T>(url: string, token: string, options: RequestInit = {}): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                },
            });

            // Google API returns 204 No Content for deletes
            if (response.status === 204) return {} as T;

            if (response.ok) return response.json();

            const errText = await response.text();
            const status = response.status;

            // Don't retry client errors (4xx) except 429 (rate limit)
            if (status >= 400 && status < 500 && status !== 429) {
                console.error(`Google API error [${status}]:`, errText);
                throw new Error(`Google API returned ${status}. ${status === 401 ? "Token may have expired." : "Bad request."}`);
            }

            // Retryable: 429 (rate limit) or 5xx (server error)
            lastError = new Error(`Google API returned ${status}`);
            console.warn(`Google API [${status}] — retry ${attempt + 1}/${MAX_RETRIES}`);
        } catch (err: any) {
            lastError = err instanceof Error ? err : new Error(String(err));

            // If it's a non-retryable error we threw above, rethrow immediately
            if (lastError.message.includes("Bad request") || lastError.message.includes("expired")) {
                throw lastError;
            }

            console.warn(`Google API fetch error — retry ${attempt + 1}/${MAX_RETRIES}:`, lastError.message);
        }

        // Wait before retrying (skip wait on last attempt)
        if (attempt < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
        }
    }

    console.error("Google API failed after all retries:", lastError?.message);
    throw lastError || new Error("Google API request failed after retries.");
}
