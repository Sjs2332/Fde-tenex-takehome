"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
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

    const hasLoadedInitialRef = useRef(false);

    const refreshHistory = useCallback(async () => {
        if (!user) return;
        setLoadingHistory(true);
        try {
            const history = await ConversationService.getConversations(user.uid);
            setConversations(history);

            if (!hasLoadedInitialRef.current && history.length > 0) {
                setActiveConversationId(history[0].id);
                hasLoadedInitialRef.current = true;
            } else if (!hasLoadedInitialRef.current) {
                hasLoadedInitialRef.current = true;
            }
        } catch (error) {
            console.error("Failed to load conversation history:", error);
        } finally {
            setLoadingHistory(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) refreshHistory();
    }, [user, refreshHistory]);

    const startNewChat = useCallback(() => {
        setActiveConversationId(`conv-${Date.now()}`);
    }, []);

    const loadConversation = useCallback((id: string) => {
        setActiveConversationId(id);
    }, []);

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
