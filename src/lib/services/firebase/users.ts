import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    createdAt: Timestamp | null;
    lastLoginAt: Timestamp | null;
}

// ─── Service ───────────────────────────────────────────────────────────────────

/**
 * Firestore User Profile Service
 *
 * Stores and retrieves user profile data collected from Google OAuth.
 * Called on every login to keep lastLoginAt current.
 */
export const UserService = {
    /**
     * Create or update user profile on login.
     * Uses merge: true so existing fields (like createdAt) are preserved.
     */
    async upsertOnLogin(user: {
        uid: string;
        displayName: string | null;
        email: string | null;
        photoURL: string | null;
    }): Promise<void> {
        try {
            const userRef = doc(db, "users", user.uid);
            const existing = await getDoc(userRef);

            const data: Record<string, any> = {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                lastLoginAt: serverTimestamp(),
            };

            // Only set createdAt on first login
            if (!existing.exists()) {
                data.createdAt = serverTimestamp();
            }

            await setDoc(userRef, data, { merge: true });
        } catch (err) {
            console.error("UserService.upsertOnLogin failed:", err);
        }
    },

    /**
     * Fetch a user profile.
     */
    async getProfile(uid: string): Promise<UserProfile | null> {
        try {
            const userRef = doc(db, "users", uid);
            const snapshot = await getDoc(userRef);
            if (!snapshot.exists()) return null;
            return { uid, ...snapshot.data() } as UserProfile;
        } catch (err) {
            console.error("UserService.getProfile failed:", err);
            return null;
        }
    },
};
