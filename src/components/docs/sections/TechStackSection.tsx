import { SectionHeading } from "../ui";
import { techStack } from "../data";

export function TechStackSection() {
    return (
        <section>
            <SectionHeading
                id="tech-stack"
                badge="Stack"
                title="Tech Stack"
            />
            <div className="overflow-x-auto rounded-xl border bg-card">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-muted/40">
                            <th className="px-6 py-3 text-left font-semibold text-foreground">
                                Layer
                            </th>
                            <th className="px-6 py-3 text-left font-semibold text-foreground">
                                Technology
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {techStack.map((t, i) => (
                            <tr
                                key={t.layer}
                                className={
                                    i % 2 === 0 ? "bg-card" : "bg-muted/20"
                                }
                            >
                                <td className="px-6 py-3 font-medium text-foreground whitespace-nowrap">
                                    {t.layer}
                                </td>
                                <td className="px-6 py-3 text-muted-foreground">
                                    {t.tech}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
