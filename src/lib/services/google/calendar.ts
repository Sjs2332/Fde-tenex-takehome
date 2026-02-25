import { googleFetch } from "./google-client";
import { GoogleCalendarEvent, CalendarFetchResponse } from "@/types/google/calendar";

/**
 * Calendar Service
 * Handles all Google Calendar specific business logic.
 */
export const CalendarService = {
    /**
     * Fetches events from the past 30 days through the next 30 days,
     * returning all events in chronological start-time order.
     */
    async getUpcomingEvents(): Promise<GoogleCalendarEvent[]> {
        const past = new Date();
        past.setDate(past.getDate() - 30);
        const timeMin = past.toISOString();

        const future = new Date();
        future.setDate(future.getDate() + 30);
        const timeMax = future.toISOString();

        const endpoint = `/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
        const data = await googleFetch<CalendarFetchResponse>(endpoint);

        return data.items || [];
    },

    /**
     * Creates a new event in the primary calendar.
     */
    async createEvent(event: GoogleCalendarEvent): Promise<GoogleCalendarEvent> {
        const endpoint = `/calendar/v3/calendars/primary/events?conferenceDataVersion=1`;

        return await googleFetch<GoogleCalendarEvent>(endpoint, {
            method: 'POST',
            body: JSON.stringify(event),
        });
    }
};
