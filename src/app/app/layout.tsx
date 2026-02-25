"use client";

import { LeftSidebar } from "@/components/app/navigation/LeftSidebar";
import { RightSidebar } from "@/components/app/navigation/RightSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/app/navigation/DashboardHeader";

import { useAuth } from "@/components/providers/AuthProvider";
import { CalendarProvider } from "@/hooks/use-calendar";
import { ChatSessionProvider } from "@/hooks/use-chat-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-background">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-16 bg-primary/20 rounded-xl" />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Intelligence Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <CalendarProvider>
            <ChatSessionProvider>
                <SidebarProvider>
                    <LeftSidebar />
                    <SidebarInset className="bg-muted/30">
                        <DashboardHeader />
                        <main className="flex flex-1 flex-col overflow-hidden">
                            {children}
                        </main>
                    </SidebarInset>
                    <RightSidebar />
                </SidebarProvider>
            </ChatSessionProvider>
        </CalendarProvider>
    );
}

