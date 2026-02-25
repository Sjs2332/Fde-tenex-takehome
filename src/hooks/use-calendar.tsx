"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CalendarService } from "@/lib/services/google/calendar";
import { useAuth } from "@/components/providers/AuthProvider";
import { GoogleCalendarEvent } from "@/types/google/calendar";

interface CalendarContextValue {
    events: GoogleCalendarEvent[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const CalendarContext = createContext<CalendarContextValue>({
    events: [],
    loading: false,
    error: null,
    refetch: async () => { },
});

/**
 * Provides calendar data to the entire app tree.
 * Both ChatInterface and RightSidebar share the same events + refetch.
 */
export function CalendarProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const fetched = await CalendarService.getUpcomingEvents();
            setEvents(fetched);
            setError(null);
        } catch (err) {
            console.error("CalendarProvider: fetch error", err);
            setError("Failed to sync calendar");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return (
        <CalendarContext.Provider value= {{ events, loading, error, refetch }
}>
    { children }
    </CalendarContext.Provider>
    );
}

/** Hook to access the shared calendar state. */
export function useCalendar() {
    return useContext(CalendarContext);
}
