export interface GoogleCalendarEvent {
    id?: string;
    summary: string;
    location?: string;
    description?: string;
    start: {
        dateTime?: string;
        date?: string;
        timeZone?: string;
    };
    end: {
        dateTime?: string;
        date?: string;
        timeZone?: string;
    };
    attendees?: {
        email: string;
        displayName?: string;
        responseStatus?: string;
    }[];
    conferenceData?: {
        createRequest?: {
            requestId: string;
            conferenceSolutionKey: {
                type: string;
            };
        };
        entryPoints?: {
            entryPointType: string;
            uri: string;
            label?: string;
        }[];
    };
    status?: 'confirmed' | 'tentative' | 'cancelled';
    htmlLink?: string;
}
