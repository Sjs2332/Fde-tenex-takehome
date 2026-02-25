"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    Clock,
    MapPin,
    Video,
    Users,
    AlignLeft,
    ExternalLink,
    CheckCircle2,
    Loader2,
} from "lucide-react";
import { GoogleCalendarEvent } from "@/types/google/calendar";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { getEventStatus, getInitials } from "@/lib/calendar-utils";

// ─── Component ────────────────────────────────────────────────────────────────

interface EventDetailModalProps {
    event: GoogleCalendarEvent | null;
    isOpen: boolean;
    onClose: () => void;
}

export function EventDetailModal({ event, isOpen, onClose }: EventDetailModalProps) {
    if (!event) return null;

    const status = getEventStatus(event);
    const startDT = event.start?.dateTime ? parseISO(event.start.dateTime) : null;
    const endDT = event.end?.dateTime ? parseISO(event.end.dateTime) : null;
    const meetLink = event.conferenceData?.entryPoints?.find(e => e.entryPointType === "video")?.uri;

    const renderStatusBadge = () => {
        if (status === "done") return (
            <Badge className="bg-emerald-500 hover:bg-emerald-500 gap-1 text-xs">
                <CheckCircle2 className="h-3 w-3" /> Done
            </Badge>
        );
        if (status === "in-progress") return (
            <Badge className="bg-orange-500 hover:bg-orange-500 gap-1 text-xs">
                <Loader2 className="h-3 w-3 animate-spin" /> In Progress
            </Badge>
        );
        if (status === "soon") return (
            <Badge className="bg-primary gap-1 text-xs">Soon</Badge>
        );
        return null;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[520px] border-none bg-background/95 backdrop-blur-2xl shadow-2xl rounded-3xl p-0 overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-primary/5 px-6 pt-6 pb-5 border-b border-primary/10">
                    <DialogHeader>
                        <div className="flex items-start justify-between gap-3">
                            <div className="bg-primary/10 w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5">
                                <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <DialogTitle className="text-lg font-black tracking-tight leading-snug pr-2">
                                    {event.summary || "Untitled Event"}
                                </DialogTitle>
                                <div className="mt-2">
                                    {renderStatusBadge()}
                                </div>
                            </div>
                        </div>
                        <DialogDescription className="sr-only">Event details</DialogDescription>
                    </DialogHeader>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">

                    {/* Date & Time */}
                    {startDT && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Date & Time</p>
                                <p className="text-sm font-semibold">
                                    {format(startDT, "EEEE, MMMM d, yyyy")}
                                </p>
                                <p className="text-sm text-muted-foreground font-medium">
                                    {format(startDT, "h:mm a")}
                                    {endDT && ` – ${format(endDT, "h:mm a")}`}
                                </p>
                            </div>
                        </div>
                    )}

                    <Separator className="opacity-50" />

                    {/* Location or Meet */}
                    {(event.location || meetLink) && (
                        <>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                                    {meetLink ? (
                                        <Video className="h-4 w-4 text-blue-500" />
                                    ) : (
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="space-y-1 flex-1 min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                        {meetLink ? "Video Call" : "Location"}
                                    </p>
                                    {meetLink ? (
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl h-8 text-xs font-bold gap-2 border-blue-500/30 text-blue-500 hover:bg-blue-500/10 hover:text-blue-600"
                                        >
                                            <a href={meetLink} target="_blank" rel="noopener noreferrer">
                                                <Video className="h-3 w-3" />
                                                Join Google Meet
                                                <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
                                            </a>
                                        </Button>
                                    ) : (
                                        <p className="text-sm font-medium text-foreground truncate">{event.location}</p>
                                    )}
                                </div>
                            </div>
                            <Separator className="opacity-50" />
                        </>
                    )}

                    {/* Attendees */}
                    {event.attendees && event.attendees.length > 0 && (
                        <>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                        Guests ({event.attendees.length})
                                    </p>
                                    <div className="space-y-2 max-h-[140px] overflow-y-auto scrollbar-none pr-1">
                                        {event.attendees.map((attendee, i) => (
                                            <div key={i} className="flex items-center gap-2.5">
                                                <Avatar className="h-6 w-6 shrink-0">
                                                    <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
                                                        {getInitials(attendee.email)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold leading-tight truncate">
                                                        {attendee.displayName || attendee.email.split("@")[0]}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground truncate">{attendee.email}</p>
                                                </div>
                                                {attendee.responseStatus && (
                                                    <span className={cn(
                                                        "ml-auto text-[9px] font-bold uppercase tracking-wide shrink-0",
                                                        attendee.responseStatus === "accepted" ? "text-emerald-500" :
                                                            attendee.responseStatus === "declined" ? "text-rose-500" :
                                                                "text-muted-foreground"
                                                    )}>
                                                        {attendee.responseStatus === "needsAction" ? "Invited" : attendee.responseStatus}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <Separator className="opacity-50" />
                        </>
                    )}

                    {/* Description */}
                    {event.description && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                                <AlignLeft className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="space-y-1 flex-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Description</p>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line max-h-[120px] overflow-y-auto scrollbar-none">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* View in Google Calendar */}
                    {event.htmlLink && (
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="w-full rounded-xl h-10 text-xs font-bold gap-2 text-muted-foreground hover:text-foreground border border-border/50 hover:bg-accent/60 mt-2"
                        >
                            <a href={event.htmlLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3.5 w-3.5" />
                                Open in Google Calendar
                            </a>
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
