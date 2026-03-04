import { SectionHeading } from "../ui";
import { apiEndpoints } from "../data";

export function ApiReferenceSection() {
    return (
        <section>
            <SectionHeading
                id="api-reference"
                badge="API"
                title="API Reference"
                description="6 API routes, all server-side Next.js route handlers. The key architectural decision: Google tokens live in HttpOnly cookies and are read server-side — the client and the LLM never see them."
            />
            <div className="space-y-4">
                {apiEndpoints.map((e) => (
                    <div
                        key={`${e.method}-${e.path}`}
                        className="flex flex-col gap-2 rounded-xl border bg-card p-5 sm:flex-row sm:items-start sm:gap-4"
                    >
                        <span
                            className={`inline-flex w-fit shrink-0 items-center rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${e.method === "GET"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : e.method === "POST"
                                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                                }`}
                        >
                            {e.method}
                        </span>
                        <div>
                            <code className="text-sm font-semibold text-foreground">
                                {e.path}
                            </code>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {e.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
