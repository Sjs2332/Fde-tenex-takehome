import { SectionHeading } from "../ui";
import { securityItems } from "../data";

export function SecuritySection() {
    return (
        <section>
            <SectionHeading
                id="security"
                badge="Security"
                title="Security & Protections"
                description="8 security layers implemented across next.config.ts, API routes, and Firestore rules. Each one addresses a specific attack vector — not just checkbox compliance."
            />
            <div className="grid gap-4 sm:grid-cols-2">
                {securityItems.map((s) => (
                    <div
                        key={s.label}
                        className="rounded-xl border bg-card p-5 transition-all hover:shadow-sm"
                    >
                        <h4 className="text-sm font-semibold text-foreground">
                            {s.label}
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                            {s.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
