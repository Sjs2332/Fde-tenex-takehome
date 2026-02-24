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
                            <div className="rounded-xl bg-primary p-2 text-primary-foreground shadow-sm transition-all group-hover:shadow-md group-hover:-translate-y-0.5">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Section (Centered) */}
                    <nav className="hidden md:flex items-center justify-center gap-10">
                        <Link
                            href="#features"
                            className="text-sm font-medium text-muted-foreground/70 transition-colors hover:text-foreground"
                        >
                            Features
                        </Link>
                        <Link
                            href="#pricing"
                            className="text-sm font-medium text-muted-foreground/70 transition-colors hover:text-foreground"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="#about"
                            className="text-sm font-medium text-muted-foreground/70 transition-colors hover:text-foreground"
                        >
                            About
                        </Link>
                    </nav>

                    {/* CTA Section (Right Aligned) */}
                    <div className="flex items-center justify-end">
                        <Button size="sm" className="rounded-full px-6 font-semibold shadow-sm transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
                            Get Started
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
