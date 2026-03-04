import { SectionHeading } from "../ui";

export function GettingStartedSection() {
    return (
        <section>
            <SectionHeading
                id="getting-started"
                badge="Setup"
                title="Getting Started"
                description="Clone, configure, and run the project locally."
            />

            <div className="space-y-6">
                {/* Step 1 */}
                <div className="rounded-xl border bg-card p-6">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            1
                        </span>
                        Prerequisites
                    </h3>
                    <ul className="mt-3 ml-9 list-disc space-y-1 text-sm text-muted-foreground">
                        <li>Node.js 18+</li>
                        <li>Firebase project with Authentication + Firestore</li>
                        <li>
                            Google Cloud project with Calendar API + Gmail API
                            enabled
                        </li>
                        <li>OpenAI API key</li>
                    </ul>
                </div>

                {/* Step 2 */}
                <div className="rounded-xl border bg-card p-6">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            2
                        </span>
                        Clone &amp; Install
                    </h3>
                    <div className="mt-3 overflow-x-auto rounded-lg bg-muted/60 p-4 font-mono text-sm text-foreground">
                        <code>
                            git clone
                            https://github.com/Sjs2332/Fde-tenex-takehome.git
                            <br />
                            cd Fde-tenex-takehome
                            <br />
                            npm install
                        </code>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="rounded-xl border bg-card p-6">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            3
                        </span>
                        Configure Environment
                    </h3>
                    <div className="mt-3 overflow-x-auto rounded-lg bg-muted/60 p-4 font-mono text-sm text-foreground">
                        <code>cp .env.example .env</code>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Fill in your Firebase config, Google Client ID, and OpenAI
                        API key. See{" "}
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
                            .env.example
                        </code>{" "}
                        for all required variables.
                    </p>
                </div>

                {/* Step 4 */}
                <div className="rounded-xl border bg-card p-6">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            4
                        </span>
                        Run
                    </h3>
                    <div className="mt-3 overflow-x-auto rounded-lg bg-muted/60 p-4 font-mono text-sm text-foreground">
                        <code>npm run dev</code>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Open{" "}
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
                            http://localhost:3000
                        </code>{" "}
                        and sign in with Google to start chatting with your
                        calendar.
                    </p>
                </div>
            </div>
        </section>
    );
}
