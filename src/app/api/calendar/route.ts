import { getServerToken } from "@/lib/auth/token-manager";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const token = await getServerToken();
        if (!token) {
            return NextResponse.json({ error: "Unauthorized. Google access token missing." }, { status: 401 });
        }

        const past = new Date();
        past.setDate(past.getDate() - 30);
        const timeMin = past.toISOString();

        const future = new Date();
        future.setDate(future.getDate() + 30);
        const timeMax = future.toISOString();

        const endpoint = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

        const response = await fetch(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error("Google API proxy error:", response.status, errBody);
            return NextResponse.json({ error: `Google API returned ${response.status}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Failed to fetch calendar data:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const token = await getServerToken();
        if (!token) {
            return NextResponse.json({ error: "Unauthorized. Google access token missing." }, { status: 401 });
        }

        const body = await req.json();
        const endpoint = `https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1`;

        const response = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error("Google API proxy POST error:", response.status, errBody);
            return NextResponse.json({ error: `Google API returned ${response.status}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Failed to create calendar event:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
