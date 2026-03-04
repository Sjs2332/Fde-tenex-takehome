import { Badge } from "../ui";

export function DocsHero() {
    return (
        <section className="relative overflow-hidden border-b bg-muted/20 py-20 md:py-28">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(var(--primary-rgb),0.08)_0%,transparent_100%)]" />
            <div className="mx-auto max-w-4xl px-4 text-center">
                <Badge>FDE Take-Home Submission</Badge>
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl leading-[1.1]">
                    Tenex Intelligence
                    <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Architecture Walkthrough
                    </span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
                    Full-stack AI calendar agent built with Next.js 16, Vercel AI SDK v6, and Google Calendar API.
                    Below: every design decision, component architecture, security layer, and API surface — with interactive previews.
                </p>
            </div>
        </section>
    );
}
