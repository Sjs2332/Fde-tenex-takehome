import { GoogleCalendarEvent } from "@/types/google/calendar";

/**
 * Calendar Service
 * Handles all Google Calendar specific business logic by proxying 
 * through our secure Next.js server route to protect tokens.
 */
export const CalendarService = {
    /**
     * Fetches events from the past 30 days through the next 30 days,
     * returning all events in chronological start-time order.
     */
    async getUpcomingEvents(): Promise<GoogleCalendarEvent[]> {
        const response = await fetch('/api/calendar');
        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.statusText}`);
        }

        const data = await response.json();
        return data.items || [];
    },

    /**
     * Creates a new event in the primary calendar.
     */
    async createEvent(event: GoogleCalendarEvent): Promise<GoogleCalendarEvent> {
        const response = await fetch('/api/calendar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (!response.ok) {
            throw new Error(`Failed to create event: ${response.statusText}`);
        }

        return await response.json();
    }
};
