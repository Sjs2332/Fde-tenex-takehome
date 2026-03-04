import { navItems } from "../data";

export function DocsSidebar() {
    return (
        <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
                {navItems.map((n) => (
                    <a
                        key={n.id}
                        href={`#${n.id}`}
                        className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        {n.label}
                    </a>
                ))}
            </nav>
        </aside>
    );
}
