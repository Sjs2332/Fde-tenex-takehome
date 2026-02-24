"use client";

import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="relative overflow-hidden min-h-[80vh] flex items-center justify-center py-24 md:py-32 lg:py-40">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(var(--primary-rgb),0.1)_0%,transparent_100%)]" />

            <div className="container relative z-10 mx-auto px-4">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl leading-[1.1]">
                        Build Something <span className="text-primary">Extraordinary</span>
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl md:leading-relaxed">
                        Supercharge your workflow with our premium Next.js and shadcn/ui starter.
                        Designed for speed, built for performance, and styled for excellence.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button size="lg" className="h-12 px-8 text-base w-full sm:w-auto">
                            Start Building Now
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base w-full sm:w-auto">
                            View Documentation
                        </Button>
                    </div>
                </div>
            </div>

            {/* Subtle bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>
    );
}
