import {
    collection,
    doc,
    setDoc,
    getDoc,
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

interface ConversationMessage {
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
        messages: { id: string; role: string; content: string; createdAt?: Date | Date | any }[]
    ): Promise<void> {
        const convRef = doc(db, "users", userId, "conversations", conversationId);

        const serializedMessages = messages.map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            createdAt: msg.createdAt || new Date(),
        })).slice(-50);

        // Check if conversation already exists to avoid overwriting createdAt
        const existing = await getDoc(convRef);

        const docData: Record<string, unknown> = {
            title,
            updatedAt: serverTimestamp(),
            messageCount: messages.length,
            messages: serializedMessages,
        };

        // Only set createdAt on first save
        if (!existing.exists()) {
            docData.createdAt = serverTimestamp();
        }

        await setDoc(convRef, docData, { merge: true });
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
     * Fetch messages for a specific conversation.
     */
    async getMessages(userId: string, conversationId: string): Promise<ConversationMessage[]> {
        const convRef = doc(db, "users", userId, "conversations", conversationId);
        const convSnap = await getDoc(convRef);

        if (!convSnap.exists()) return [];
        const data = convSnap.data();

        // Fast path: use the exact 1-document-read format
        if (data.messages && Array.isArray(data.messages)) {
            return data.messages as ConversationMessage[];
        }

        // Legacy fallback path: if `messages` field doesn't exist, they're on the old subcollection format
        const messagesRef = collection(convRef, "messages");
        const q = query(messagesRef, orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as ConversationMessage[];
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
