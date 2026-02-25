import { getServerToken } from "@/lib/auth/token-manager";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const token = await getServerToken();
        if (!token) {
            return NextResponse.json({ error: "Unauthorized. Google access token missing." }, { status: 401 });
        }

        const body = await req.json();

        const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error("Google API proxy Gmail send error:", response.status, errBody);
            return NextResponse.json({ error: `Gmail API returned ${response.status}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Failed to send email via proxy:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
