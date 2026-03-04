import { Badge } from "./Badge";

export function SectionHeading({
    id,
    badge,
    title,
    description,
}: {
    id: string;
    badge: string;
    title: string;
    description?: string;
}) {
    return (
        <div className="mb-8">
            <Badge>{badge}</Badge>
            <h2
                id={id}
                className="mt-3 text-3xl font-bold tracking-tight text-foreground scroll-mt-24"
            >
                {title}
            </h2>
            {description && (
                <p className="mt-2 max-w-2xl text-muted-foreground text-base leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
}
