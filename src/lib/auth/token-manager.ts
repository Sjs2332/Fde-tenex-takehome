import { cookies } from "next/headers";

/**
 * Server-side Token Manager
 *
 * Handles Google OAuth tokens using HttpOnly cookies instead of localStorage.
 * This prevents XSS attacks from accessing tokens — only the server can
 * read/write them.
 */

const COOKIE_NAME = "gat"; // google access token
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 3600, // 1 hour — matches Google token TTL
};

/** Reads the Google access token from the HttpOnly cookie. */
export async function getServerToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value || null;
}

/** Sets the Google access token in an HttpOnly cookie. */
export async function setServerToken(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

/** Clears the Google access token cookie. */
export async function clearServerToken(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}
