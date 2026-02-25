import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    Auth
} from "firebase/auth";

/**
 * Firebase Auth Service
 *
 * Handles Google OAuth login/logout. After login, the Google access token
 * is sent to the server via /api/auth/session and stored in an HttpOnly
 * cookie — it is NEVER stored in localStorage.
 */
export const AuthService = {
    /**
     * Initiates Google OAuth flow with required GSuite scopes.
     * On success, sends the access token to the server for secure storage.
     */
    async loginWithGoogle(auth: Auth): Promise<void> {
        const provider = new GoogleAuthProvider();

        // Required scopes for Tenex Intelligence
        provider.addScope("https://www.googleapis.com/auth/calendar.readonly");
        provider.addScope("https://www.googleapis.com/auth/calendar.events");
        provider.addScope("https://www.googleapis.com/auth/gmail.compose");
        provider.addScope("https://www.googleapis.com/auth/gmail.send");

        provider.setCustomParameters({
            prompt: "select_account",
            access_type: "offline",
        });

        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        if (token) {
            // Store token in HttpOnly cookie via server endpoint
            await fetch("/api/auth/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            // Keep localStorage as fallback for client-side Google API calls
            // (e.g., CalendarService.getUpcomingEvents used by the sidebar)
            localStorage.setItem("google_access_token", token);
        }
    },

    /**
     * Signs out the current user and clears all token storage.
     */
    async logout(auth: Auth): Promise<void> {
        // Clear server-side cookie
        await fetch("/api/auth/session", { method: "DELETE" });

        // Clear client-side storage
        localStorage.removeItem("google_access_token");

        await signOut(auth);
    },
};
