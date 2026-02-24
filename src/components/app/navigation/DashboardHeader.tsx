"use client";

import React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Search, Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
    title?: string;
}

export function DashboardHeader({ title = "AI Assistant" }: DashboardHeaderProps) {
    return (
        <header className="grid grid-cols-3 h-16 shrink-0 items-center border-b bg-background/50 backdrop-blur-md px-6 sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-bold">{title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex justify-center">
                <div className="relative w-full max-w-md group">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                        placeholder="Search events, meetings, or tasks..."
                        className="w-full bg-muted/50 pl-10 h-10 rounded-xl border-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="flex justify-end">
            </div>
        </header>
    );
}
