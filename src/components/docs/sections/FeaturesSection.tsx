import { SectionHeading } from "../ui";
import { features } from "../data";

export function FeaturesSection() {
    return (
        <section>
            <SectionHeading
                id="features"
                badge="Overview"
                title="Features"
                description="Each feature below maps to specific code decisions — tool definitions, prompt engineering patterns, state management, and API design. I built these to be production-ready, not just demo-ready."
            />
            <div className="grid gap-5 sm:grid-cols-2">
                {features.map((f) => (
                    <div
                        key={f.title}
                        className="group relative rounded-xl border bg-card p-6 transition-all hover:shadow-md hover:border-primary/30"
                    >
                        <span className="mb-3 block text-2xl">{f.icon}</span>
                        <h3 className="text-base font-semibold text-foreground">
                            {f.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                            {f.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
