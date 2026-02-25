"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ConversationService, Conversation } from "@/lib/services/firebase/conversations";
import { useAuth } from "@/components/providers/AuthProvider";

interface ChatSessionContextType {
    activeConversationId: string;
    conversations: Conversation[];
    loadingHistory: boolean;
    startNewChat: () => void;
    loadConversation: (id: string) => void;
    refreshHistory: () => Promise<void>;
}

const ChatSessionContext = createContext<ChatSessionContextType | undefined>(undefined);

export function ChatSessionProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [activeConversationId, setActiveConversationId] = useState<string>(`conv-${Date.now()}`);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

    const refreshHistory = async () => {
        if (!user) return;
        setLoadingHistory(true);
        try {
            const history = await ConversationService.getConversations(user.uid);
            setConversations(history);

            if (!hasLoadedInitial && history.length > 0) {
                // Auto-load most recent conversation on page load
                setActiveConversationId(history[0].id);
                setHasLoadedInitial(true);
            } else if (!hasLoadedInitial) {
                setHasLoadedInitial(true);
            }
        } catch (error) {
            console.error("Failed to load conversation history:", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        if (user) refreshHistory();
    }, [user]);

    const startNewChat = () => {
        setActiveConversationId(`conv-${Date.now()}`);
    };

    const loadConversation = (id: string) => {
        setActiveConversationId(id);
    };

    return (
        <ChatSessionContext.Provider value={{
            activeConversationId,
            conversations,
            loadingHistory,
            startNewChat,
            loadConversation,
            refreshHistory
        }}>
            {children}
        </ChatSessionContext.Provider>
    );
}

export function useChatSession() {
    const context = useContext(ChatSessionContext);
    if (!context) throw new Error("useChatSession must be used within ChatSessionProvider");
    return context;
}
