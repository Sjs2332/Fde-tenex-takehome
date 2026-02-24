"use client";

import * as React from "react";
import {
    Calendar,
    MessageSquare,
    Settings,
    Clock,
    LayoutDashboard,
    LogOut,
    ChevronUp,
    User2,
    Plus,
    Sparkles,
    Zap,
    Search,
    History,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function LeftSidebar() {
    const navItems = [
        { name: "AI Assistant", icon: Sparkles, url: "/app", isActive: true, badge: "AI" },
    ];

    return (
        <Sidebar collapsible="none" className="h-screen sticky top-0 border-r bg-sidebar/50 backdrop-blur-xl">
            <SidebarHeader className="border-b h-16 flex items-center px-6">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center gap-3">
                            <div className="flex aspect-square size-9 items-center justify-center rounded-xl transition-transform hover:scale-105 active:scale-95">
                                <svg width="34" height="24" viewBox="0 0 60 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect y="0.000183105" width="60" height="42.6168" fill="#FFE501" rx="4" />
                                    <rect x="16.3604" y="7.48938" width="27.3999" height="8.27911" transform="rotate(90 16.3604 7.48938)" fill="black" />
                                    <path d="M51.9209 16.5607L51.9209 7.71429L42.788 7.71429L42.788 16.5607L51.9209 16.5607Z" fill="black" />
                                    <path d="M42.79 25.4065L42.79 16.5601L33.6572 16.5601L33.6572 25.4065L42.79 25.4065Z" fill="black" />
                                    <path d="M51.9209 34.2547L51.9209 25.4083L42.788 25.4083L42.788 34.2547L51.9209 34.2547Z" fill="black" />
                                    <path d="M33.6562 16.5607L33.6562 7.71429L24.5234 7.71429L24.5234 16.5607L33.6562 16.5607Z" fill="black" />
                                    <path d="M33.6562 34.2546L33.6562 25.4082L24.5234 25.4082L24.5234 34.2546L33.6562 34.2546Z" fill="black" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-base tracking-tight leading-none text-foreground">Tenex</span>
                                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] mt-1.5 whitespace-nowrap">Intelligence</span>
                            </div>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-4 py-8 space-y-8">


                <SidebarGroup>
                    <SidebarGroupLabel className="px-2 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60 mb-2">
                        Workspace
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1">

                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton
                                        asChild
                                        className={cn(
                                            "h-11 px-3 rounded-xl transition-all duration-200 group relative",
                                            item.isActive ? "bg-primary/10 text-primary hover:bg-primary/15" : "hover:bg-accent hover:text-accent-foreground"
                                        )}
                                    >
                                        <a href={item.url} className="flex items-center w-full">
                                            <item.icon className={cn("h-[18px] w-[18px] mr-3 font-medium", item.isActive ? "text-primary stroke-[2.5]" : "text-muted-foreground group-hover:text-foreground")} />
                                            <span className={cn("text-sm font-semibold", item.isActive ? "" : "text-muted-foreground group-hover:text-foreground")}>{item.name}</span>
                                            {item.badge && (
                                                <Badge className="ml-auto bg-primary text-[10px] px-1.5 py-0 h-4 border-none shadow-sm">{item.badge}</Badge>
                                            )}
                                            {item.isActive && (
                                                <div className="absolute left-[-16px] w-[4px] h-6 bg-primary rounded-r-full" />
                                            )}
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>


            </SidebarContent>

            <SidebarFooter className="border-t p-4 mt-auto">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg" className="h-14 rounded-2xl hover:bg-accent/50 group transition-all">
                                    <div className="relative">
                                        <Avatar className="h-10 w-10 border-2 border-background shadow-md">
                                            <AvatarImage src="https://github.com/shadcn.png" alt="Jawad Shah" />
                                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-bold">JS</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500 shadow-sm" />
                                    </div>
                                    <div className="grid flex-1 text-left ml-3">
                                        <span className="truncate text-sm font-bold text-foreground">Jawad Shah</span>
                                        <span className="truncate text-[11px] text-muted-foreground font-medium uppercase tracking-tight">Personal Workspace</span>
                                    </div>
                                    <ChevronUp className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="end"
                                className="w-64 p-2 rounded-2xl shadow-2xl border-sidebar-border"
                            >
                                <div className="px-2 py-3 border-b mb-1">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest hidden">Account</p>
                                    <p className="text-sm font-bold truncate">jawad@tenex.ai</p>
                                </div>
                                <DropdownMenuItem className="h-10 rounded-lg focus:bg-accent p-2">
                                    <User2 className="mr-2 h-4 w-4" />
                                    <span className="font-semibold text-sm">Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="h-10 rounded-lg focus:bg-accent p-2">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span className="font-semibold text-sm">Settings</span>
                                </DropdownMenuItem>
                                <div className="h-px bg-sidebar-border my-1" />
                                <DropdownMenuItem className="h-10 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive p-2">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span className="font-semibold text-sm">Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
