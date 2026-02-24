"use client";

import React from "react";
import { Video, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatsGrid() {
    const stats = [
        { label: "Meetings", value: "12", delta: "+2", icon: Video, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Focus", value: "24h", delta: "+3.5", icon: Clock, color: "text-green-500", bg: "bg-green-500/10" },
        { label: "Tasks", value: "85%", delta: "12", icon: CheckCircle2, color: "text-purple-500", bg: "bg-purple-500/10" }
    ];

    return (
        <div className="grid grid-cols-3 gap-3 w-full max-w-[450px]">
            {stats.map((stat, i) => (
                <div key={i} className="bg-background border rounded-2xl p-3 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                    <div className={cn("p-1.5 w-fit rounded-lg mb-2", stat.bg)}>
                        <stat.icon className={cn("h-4 w-4", stat.color)} />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{stat.label}</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black">{stat.value}</span>
                            <span className="text-[9px] font-bold text-green-500">{stat.delta}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
