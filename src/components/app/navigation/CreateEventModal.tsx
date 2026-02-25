"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CalendarService } from "@/lib/services/google/calendar";
import { GoogleCalendarEvent } from "@/types/google/calendar";
import { Loader2, Calendar as CalendarIcon, Users, MapPin, AlignLeft, Video } from "lucide-react";

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateEventModal({ isOpen, onClose, onSuccess }: CreateEventModalProps) {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [guests, setGuests] = useState("");
    const [isGoogleMeeting, setIsGoogleMeeting] = useState(false);

    const handleStartTimeChange = (value: string) => {
        setStartTime(value);
        // Automatically set end time to 1 hour after if it's currently empty
        if (value && !endTime) {
            const start = new Date(value);
            const end = new Date(start.getTime() + 60 * 60 * 1000);

            // Format to YYYY-MM-DDTHH:mm for datetime-local input
            const pad = (n: number) => n.toString().padStart(2, '0');
            const formattedEnd = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}T${pad(end.getHours())}:${pad(end.getMinutes())}`;
            setEndTime(formattedEnd);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (new Date(endTime) <= new Date(startTime)) {
            alert("End time must be after start time");
            return;
        }

        setLoading(true);
        try {
            const event: GoogleCalendarEvent = {
                summary: title,
                location: location,
                description: description,
                start: {
                    dateTime: new Date(startTime).toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
                end: {
                    dateTime: new Date(endTime).toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
                attendees: guests ? guests.split(',').map(email => ({ email: email.trim() })) : [],
            };

            if (isGoogleMeeting) {
                event.conferenceData = {
                    createRequest: {
                        requestId: Math.random().toString(36).substring(7),
                        conferenceSolutionKey: { type: "hangoutsMeet" },
                    },
                };
            }

            await CalendarService.createEvent(event);
            onSuccess();
            onClose();
            // Reset form
            setTitle("");
            setStartTime("");
            setEndTime("");
            setLocation("");
            setDescription("");
            setGuests("");
            setIsGoogleMeeting(false);
        } catch (error) {
            console.error("Failed to create event:", error);
            alert("Failed to create event. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] border-none bg-background/95 backdrop-blur-2xl shadow-2xl rounded-3xl p-0 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-primary/5 px-8 py-8 border-b border-primary/10">
                    <DialogHeader>
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center">
                                <CalendarIcon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="text-left">
                                <DialogTitle className="text-2xl font-black tracking-tight">Schedule Intelligence</DialogTitle>
                                <DialogDescription className="text-sm font-medium text-muted-foreground mt-1">
                                    Create a new calendar event with Google Meet integration.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Basic Info */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">Event Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Quarterly Strategy Sync"
                                    className="h-12 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20 transition-all font-medium"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">Start Time</Label>
                                    <Input
                                        id="start"
                                        type="datetime-local"
                                        value={startTime}
                                        onChange={(e) => handleStartTimeChange(e.target.value)}
                                        className="h-12 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20 transition-all text-xs"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">End Time</Label>
                                    <Input
                                        id="end"
                                        type="datetime-local"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="h-12 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20 transition-all text-xs"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                                    <MapPin className="h-3 w-3" /> Location
                                </Label>
                                <Input
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Headquarters, Level 4"
                                    className="h-12 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10 transition-all hover:bg-primary/10">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/20 p-2 rounded-lg text-primary">
                                        <Video className="h-4 w-4" />
                                    </div>
                                    <div className="grid">
                                        <span className="text-sm font-bold">Google Meet</span>
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Add video link</span>
                                    </div>
                                </div>
                                <Switch
                                    checked={isGoogleMeeting}
                                    onCheckedChange={setIsGoogleMeeting}
                                    className="data-[state=checked]:bg-primary"
                                />
                            </div>
                        </div>

                        {/* Right Column: Attendees & Context */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="guests" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                                    <Users className="h-3 w-3" /> Guests
                                </Label>
                                <Input
                                    id="guests"
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                    placeholder="team@tenex.ai, design@tenex.ai"
                                    className="h-12 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20 transition-all"
                                />
                                <p className="text-[10px] text-muted-foreground/60 font-medium px-1">Separate emails with commas</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                                    <AlignLeft className="h-3 w-3" /> Description & Agenda
                                </Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What is this meeting about? Define the outcomes..."
                                    className="min-h-[148px] rounded-xl border-border/50 bg-background/50 focus:ring-primary/20 transition-all resize-none leading-relaxed text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter className="px-8 py-6 bg-muted/30 border-t border-border/50 flex items-center justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-xs uppercase tracking-widest h-12 px-6">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        onClick={handleSubmit}
                        className="rounded-xl font-bold text-xs uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 h-12 px-8 gap-2 min-w-[180px]"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarIcon className="h-4 w-4" />}
                        {loading ? "Scheduling..." : "Create Event"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
