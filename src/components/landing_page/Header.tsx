"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-3 h-16 items-center">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <svg width="60" height="43" viewBox="0 0 60 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect y="0.000183105" width="60" height="42.6168" fill="#FFE501" />
                                <rect x="16.3604" y="7.48938" width="27.3999" height="8.27911" transform="rotate(90 16.3604 7.48938)" fill="black" />
                                <path d="M51.9209 16.5607L51.9209 7.71429L42.788 7.71429L42.788 16.5607L51.9209 16.5607Z" fill="black" />
                                <path d="M42.79 25.4065L42.79 16.5601L33.6572 16.5601L33.6572 25.4065L42.79 25.4065Z" fill="black" />
                                <path d="M51.9209 34.2547L51.9209 25.4083L42.788 25.4083L42.788 34.2547L51.9209 34.2547Z" fill="black" />
                                <path d="M33.6562 16.5607L33.6562 7.71429L24.5234 7.71429L24.5234 16.5607L33.6562 16.5607Z" fill="black" />
                                <path d="M33.6562 34.2546L33.6562 25.4082L24.5234 25.4082L24.5234 34.2546L33.6562 34.2546Z" fill="black" />
                            </svg>
                        </Link>
                    </div>

                    {/* Navigation Section (Centered) */}
                    <nav className="hidden md:flex items-center justify-center gap-10">
                    </nav>

                    {/* CTA Section (Right Aligned) */}
                    <div className="flex items-center justify-end">
                        <Button asChild size="sm" className="rounded-full px-6 font-semibold shadow-sm transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
                            <a href="https://github.com/Sjs2332/Fde-tenex-takehome" target="_blank" rel="noopener noreferrer">
                                View Source
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
