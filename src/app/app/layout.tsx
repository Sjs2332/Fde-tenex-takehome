import { LeftSidebar } from "@/components/app/navigation/LeftSidebar";
import { RightSidebar } from "@/components/app/navigation/RightSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/app/navigation/DashboardHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
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
    );
}
