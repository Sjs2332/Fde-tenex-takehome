"use client";

import { useState } from "react";
import { Sparkles, ChevronUp, LogOut } from "lucide-react";

export function ShellLeftSidebar() {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="h-full border-r bg-sidebar/50 backdrop-blur-xl flex flex-col w-[260px] relative">
            {/* Header */}
            <div className="border-b h-16 flex items-center px-6">
                <div className="flex items-center gap-3">
                    <div className="flex aspect-square size-9 items-center justify-center rounded-xl">
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
            </div>

            {/* Nav */}
            <div className="px-4 py-8 space-y-8 flex-1">
                <div>
                    <p className="px-2 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60 mb-2">Workspace</p>
                    <div className="space-y-1">
                        <a href="#" className="h-11 px-3 rounded-xl bg-primary/10 text-primary flex items-center w-full" onClick={e => e.preventDefault()}>
                            <Sparkles className="h-[18px] w-[18px] mr-3 text-primary stroke-[2.5]" />
                            <span className="text-sm font-semibold">AI Assistant</span>
                            <span className="ml-auto bg-primary text-primary-foreground text-[10px] px-1.5 py-0 h-4 rounded-full flex items-center font-bold">AI</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer — clickable profile */}
            <div className="border-t p-4 mt-auto relative">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="w-full h-14 rounded-2xl hover:bg-accent/50 flex items-center px-3 cursor-pointer group transition-all"
                >
                    <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm border-2 border-background shadow-md">JS</div>
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500 shadow-sm" />
                    </div>
                    <div className="grid flex-1 text-left ml-3">
                        <span className="truncate text-sm font-bold text-foreground">Jawad Shah</span>
                        <span className="truncate text-[11px] text-muted-foreground font-medium uppercase tracking-tight">Personal Workspace</span>
                    </div>
                    <ChevronUp className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>

                {/* Logout dropdown */}
                {showMenu && (
                    <div className="absolute bottom-full left-4 right-4 mb-2 w-64 p-2 rounded-2xl shadow-2xl border border-border/60 bg-card z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                        <div className="px-2 py-3 border-b mb-1">
                            <p className="text-sm font-bold truncate">jawad@tenex.ai</p>
                        </div>
                        <button
                            onClick={() => setShowMenu(false)}
                            className="w-full h-10 rounded-lg text-destructive hover:bg-destructive/10 p-2 cursor-pointer flex items-center gap-2 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="font-semibold text-sm">Log out</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
