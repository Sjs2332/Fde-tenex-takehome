"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Send, Edit3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { googleFetch } from "@/lib/services/google/google-client";
import { useAuth } from "@/components/providers/AuthProvider";
import { ActivityService } from "@/lib/services/firebase/activity";

interface EmailDraftCardProps {
    to: string;
    subject: string;
    body: string;
}

export function EmailDraftCard({ to: initialTo, subject: initialSubject, body: initialBody }: EmailDraftCardProps) {
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const [draftTo, setDraftTo] = useState(initialTo);
    const [draftSubject, setDraftSubject] = useState(initialSubject);
    const [draftBody, setDraftBody] = useState(initialBody);

    const handleCopy = () => {
        navigator.clipboard.writeText(`To: ${draftTo}\nSubject: ${draftSubject}\n\n${draftBody}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSend = async () => {
        setIsSending(true);
        try {
            // Construct RFC 2822 email format
            const emailContent = [
                `To: ${draftTo}`,
                `Subject: ${draftSubject}`,
                `Content-Type: text/plain; charset="UTF-8"`,
                ``,
                draftBody
            ].join('\n');

            // Encode to base64url format required by Gmail API
            const base64EncodedEmail = btoa(unescape(encodeURIComponent(emailContent)))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');

            await googleFetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
                method: 'POST',
                body: JSON.stringify({ raw: base64EncodedEmail })
            });

            setIsSent(true);
            setIsEditing(false);

            // Log email send to Firestore
            if (user?.uid) {
                ActivityService.log(user.uid, "email_sent", `Sent email to ${draftTo}: ${draftSubject}`, {
                    to: draftTo, subject: draftSubject,
                });
            }
        } catch (error) {
            console.error("Failed to send email:", error);
            alert("Failed to send email. Ensure you have granted Gmail permissions, or check the console.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="w-full max-w-[500px] my-4 rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            <div className="px-5 py-4 border-b bg-muted/30 space-y-3">
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider w-14 shrink-0 whitespace-nowrap">To</span>
                    {isEditing ? (
                        <Input
                            value={draftTo}
                            onChange={e => setDraftTo(e.target.value)}
                            className="h-7 text-sm px-2 bg-background border-muted"
                        />
                    ) : (
                        <span className="text-sm font-medium break-words">{draftTo}</span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider w-14 shrink-0 whitespace-nowrap">Subject</span>
                    {isEditing ? (
                        <Input
                            value={draftSubject}
                            onChange={e => setDraftSubject(e.target.value)}
                            className="h-7 text-sm px-2 font-semibold bg-background border-muted"
                        />
                    ) : (
                        <span className="text-sm font-semibold text-foreground break-words">{draftSubject}</span>
                    )}
                </div>
            </div>

            <div className="p-5 bg-background">
                {isEditing ? (
                    <Textarea
                        value={draftBody}
                        onChange={e => setDraftBody(e.target.value)}
                        className="min-h-[150px] text-sm leading-relaxed p-0 border-none focus-visible:ring-0 shadow-none resize-y"
                    />
                ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-[450] text-foreground/90">{draftBody}</p>
                )}
            </div>

            <div className="px-4 py-3 bg-muted/10 border-t flex items-center justify-between gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs font-semibold hover:bg-muted"
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isSent || isSending}
                >
                    {isEditing ? (
                        <><Check className="h-3.5 w-3.5 mr-1.5" /> Done</>
                    ) : (
                        <><Edit3 className="h-3.5 w-3.5 mr-1.5 opacity-70" /> Edit</>
                    )}
                </Button>

                <div className="flex gap-2">
                    {!isEditing && !isSent && (
                        <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-semibold hover:bg-muted" onClick={handleCopy}>
                            {copied ? (
                                <><Check className="h-3.5 w-3.5 mr-1.5 text-green-500" /> Copied</>
                            ) : (
                                <><Copy className="h-3.5 w-3.5 mr-1.5 opacity-70" /> Copy</>
                            )}
                        </Button>
                    )}
                    <Button
                        size="sm"
                        className="h-8 px-4 text-xs font-bold rounded-lg shadow-sm"
                        onClick={handleSend}
                        disabled={isSent || isSending}
                    >
                        {isSending ? (
                            <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Sending...</>
                        ) : isSent ? (
                            <><Check className="h-3.5 w-3.5 mr-1.5 text-green-500" /> Sent</>
                        ) : (
                            <><Send className="h-3.5 w-3.5 mr-1.5" /> Send Email</>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
