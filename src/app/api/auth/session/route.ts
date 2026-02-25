import { setServerToken, clearServerToken } from "@/lib/auth/token-manager";

/**
 * POST /api/auth/session
 *
 * Receives the Google access token from the client after OAuth login
 * and stores it in an HttpOnly cookie. The client never needs to send
 * the token again — all API routes read from the cookie.
 */
export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token || typeof token !== "string") {
            return new Response(
                JSON.stringify({ error: "Token is required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        await setServerToken(token);

        return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Session API error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to create session." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

/**
 * DELETE /api/auth/session
 *
 * Clears the token cookie on logout.
 */
export async function DELETE() {
    try {
        await clearServerToken();
        return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Session delete error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to clear session." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
