import {
    collection,
    doc,
    setDoc,
    getDocs,
    deleteDoc,
    query,
    orderBy,
    limit,
    Timestamp,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ConversationMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: Timestamp | null;
}

export interface Conversation {
    id: string;
    title: string;
    createdAt: Timestamp | null;
    updatedAt: Timestamp | null;
    messageCount: number;
}

// ─── Service ───────────────────────────────────────────────────────────────────

/**
 * Firestore Conversation Service
 *
 * Handles CRUD operations for chat conversations.
 * All data is scoped to the authenticated user's document.
 */
export const ConversationService = {
    /**
     * Save or update a conversation with its messages.
     */
    async saveConversation(
        userId: string,
        conversationId: string,
        title: string,
        messages: { id: string; role: string; content: string }[]
    ): Promise<void> {
        const convRef = doc(db, "users", userId, "conversations", conversationId);

        await setDoc(convRef, {
            title,
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp(),
            messageCount: messages.length,
        }, { merge: true });

        // Save each message as a subcollection document
        const messagesRef = collection(convRef, "messages");
        const batch = messages.slice(-50); // Only persist last 50 messages

        for (const msg of batch) {
            const msgRef = doc(messagesRef, msg.id);
            await setDoc(msgRef, {
                role: msg.role,
                content: msg.content,
                createdAt: serverTimestamp(),
            }, { merge: true });
        }
    },

    /**
     * Fetch recent conversations for a user (latest 20).
     */
    async getConversations(userId: string): Promise<Conversation[]> {
        const convRef = collection(db, "users", userId, "conversations");
        const q = query(convRef, orderBy("updatedAt", "desc"), limit(20));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Conversation[];
    },

    /**
     * Delete a conversation and all its messages.
     */
    async deleteConversation(userId: string, conversationId: string): Promise<void> {
        // Delete messages subcollection first
        const messagesRef = collection(
            db, "users", userId, "conversations", conversationId, "messages"
        );
        const msgSnapshot = await getDocs(messagesRef);
        for (const msgDoc of msgSnapshot.docs) {
            await deleteDoc(msgDoc.ref);
        }

        // Delete conversation document
        await deleteDoc(doc(db, "users", userId, "conversations", conversationId));
    },
};
