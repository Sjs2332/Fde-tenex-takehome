import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit,
    where,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ActivityType =
    | "calendar_fetch"
    | "event_created"
    | "event_deleted"
    | "event_rescheduled"
    | "email_sent"
    | "email_drafted";

export interface ActivityEntry {
    id?: string;
    type: ActivityType;
    summary: string;
    metadata: Record<string, any>;
    createdAt: Timestamp | null;
}

// ─── Service ───────────────────────────────────────────────────────────────────

/**
 * Firestore Activity Log Service
 *
 * Records every action the AI agent takes on behalf of the user.
 * Data is stored under users/{userId}/activity/{activityId}.
 */
export const ActivityService = {
    /**
     * Log a single agent action.
     */
    async log(
        userId: string,
        type: ActivityType,
        summary: string,
        metadata: Record<string, any> = {}
    ): Promise<void> {
        try {
            const activityRef = collection(db, "users", userId, "activity");
            await addDoc(activityRef, {
                type,
                summary,
                metadata,
                createdAt: serverTimestamp(),
            });
        } catch (err) {
            // Activity logging should never break the main flow
            console.error("ActivityService.log failed:", err);
        }
    },

    /**
     * Fetch recent activity for a user (latest 50).
     */
    async getRecent(userId: string, count = 50): Promise<ActivityEntry[]> {
        const activityRef = collection(db, "users", userId, "activity");
        const q = query(activityRef, orderBy("createdAt", "desc"), limit(count));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as ActivityEntry[];
    },

    /**
     * Fetch activity filtered by type.
     */
    async getByType(userId: string, type: ActivityType, count = 20): Promise<ActivityEntry[]> {
        const activityRef = collection(db, "users", userId, "activity");
        const q = query(
            activityRef,
            where("type", "==", type),
            orderBy("createdAt", "desc"),
            limit(count)
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as ActivityEntry[];
    },
};
