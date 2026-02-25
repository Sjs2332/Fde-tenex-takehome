import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { createCalendarTools } from "@/lib/ai/tools";
import { getServerToken } from "@/lib/auth/token-manager";

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        // ── Validate environment ───────────────────────────────────────────────
        if (!process.env.OPENAI_API_KEY) {
            return new Response(
                JSON.stringify({ error: "OPENAI_API_KEY is not configured." }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // ── Parse request ──────────────────────────────────────────────────────
        const body = await req.json();
        const { messages } = body;

        if (!messages || !Array.isArray(messages)) {
            return new Response(
                JSON.stringify({ error: "Invalid request: 'messages' array is required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // ── Prepare context ────────────────────────────────────────────────────
        // Read token from HttpOnly cookie (primary) or Authorization header (fallback)
        const cookieToken = await getServerToken();
        const headerToken = req.headers.get("Authorization")?.replace("Bearer ", "") || null;
        const token = cookieToken || headerToken;

        const currentTimeString = new Date().toLocaleString("en-US", {
            timeZone: "America/New_York",
            weekday: "long", year: "numeric", month: "long",
            day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short"
        });

        // ── Stream response ────────────────────────────────────────────────────
        const result = streamText({
            model: openai("gpt-4o-mini"),
            system: buildSystemPrompt(currentTimeString),
            messages: await convertToModelMessages(messages),
            stopWhen: stepCountIs(5),
            tools: createCalendarTools(token),
        });

        return result.toUIMessageStreamResponse();

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred.";
        console.error("Chat API error:", message);
        return new Response(
            JSON.stringify({ error: message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
