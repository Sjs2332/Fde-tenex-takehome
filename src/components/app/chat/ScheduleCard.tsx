"use client";

import React from "react";
import { Sparkles, Clock, ArrowRight, TrendingUp } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ScheduleCard() {
    const events = [
        {
            title: "Tenex Strategy Sync",
            time: "10:00 AM",
            status: "Priority",
            color: "bg-blue-500"
        },
        {
            title: "Engineering Interview",
            time: "2:00 PM",
            color: "bg-green-500"
        },
        {
            title: "Product Review",
            time: "4:30 PM",
            color: "bg-purple-500"
        }
    ];

    return (
        <Card className="w-full max-w-[400px] border-none shadow-sm bg-background overflow-hidden rounded-2xl group cursor-pointer hover:shadow-xl transition-all duration-300">
            <CardHeader className="p-4 pb-2 border-b bg-muted/20">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Remaining Schedule
                    </CardTitle>
                    <Badge className="text-[10px] h-4 bg-primary rounded-full">3 Left</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {events.map((event, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 px-4 hover:bg-accent/40 transition-colors border-b last:border-0 relative">
                        <div className={cn("w-1 h-6 rounded-full absolute left-0", event.color)} />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{event.title}</h4>
                            <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {event.time}
                            </p>
                        </div>
                        {event.status && <Badge variant="outline" className="text-[9px] h-4 px-1 border-primary/20 text-primary">{event.status}</Badge>}
                        <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </div>
                ))}
            </CardContent>
            <div className="p-2 px-4 bg-primary/5 border-t">
                <button className="w-full text-[10px] font-bold text-primary flex items-center justify-center gap-1 uppercase tracking-wider py-1">
                    Full Calendar View <TrendingUp className="h-3 w-3" />
                </button>
            </div>
        </Card>
    );
}
