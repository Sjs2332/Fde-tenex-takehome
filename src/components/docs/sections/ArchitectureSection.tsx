import { SectionHeading } from "../ui";

const architectureTree = `src/
├── app/
│   ├── api/
│   │   ├── auth/session/route.ts      # HttpOnly cookie management
│   │   ├── calendar/route.ts          # Google Calendar proxy
│   │   ├── gmail/send/route.ts        # Gmail send proxy
│   │   └── chat/route.ts              # AI chat endpoint (streams)
│   ├── app/
│   │   ├── layout.tsx                 # CalendarProvider + SidebarProvider
│   │   └── page.tsx                   # Dashboard — ChatInterface
│   ├── docs/
│   │   └── page.tsx                   # ← You are here
│   ├── layout.tsx                     # Root: Geist fonts, AuthProvider
│   └── page.tsx                       # Landing page
├── components/
│   ├── app/
│   │   ├── chat/                      # ChatInterface, MessageRenderer, etc.
│   │   └── navigation/               # Sidebars, DashboardHeader, modals
│   ├── docs/                          # Documentation page components
│   │   ├── data/                      # Content data arrays
│   │   ├── sections/                  # Page sections (Features, Security, etc.)
│   │   ├── shells/                    # Interactive component replicas
│   │   └── ui/                        # Reusable doc primitives
│   ├── providers/                     # AuthProvider (React Context)
│   └── ui/                           # shadcn primitives
├── hooks/
│   ├── use-calendar.tsx               # Shared event state + refetch
│   └── use-chat-session.tsx           # Conversation ID + history
├── lib/
│   ├── ai/                            # System prompt, tool definitions
│   ├── auth/                          # Token manager (HttpOnly cookies)
│   ├── services/
│   │   ├── firebase/                  # Auth, conversations, activity, users
│   │   └── google/                    # Client-side calendar service
│   ├── calendar-utils.ts              # Event helpers, color utilities
│   └── utils.ts                       # Tailwind merge
└── types/
    └── google/calendar.ts             # GoogleCalendarEvent interface`;

export function ArchitectureSection() {
    return (
        <section>
            <SectionHeading
                id="architecture"
                badge="Internals"
                title="Architecture"
                description="High-level directory structure of the codebase."
            />
            <div className="overflow-x-auto rounded-xl border bg-card">
                <pre className="p-6 text-sm leading-relaxed text-muted-foreground font-mono">
                    {architectureTree}
                </pre>
            </div>
        </section>
    );
}
