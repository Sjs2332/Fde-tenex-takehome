"use client";

import { SectionHeading } from "../ui";
import {
    ShellDashboardHeader,
    ShellLeftSidebar,
    ShellRightSidebar,
    ShellChatInterface,
    ShellStatsGrid,
    ShellEventCreatedCard,
    ShellEmailDraftCard,
    ShellScheduleCard,
    ShellToolStatus,
    ShellEventCard,
    ShellReschedulePickerModal,
    ShellCreateEventModal,
    ShellEventDetailModal,
    ShellChatMessagesList,
    ShellChatInputForm,
    ShellMessageRenderer,
    ShellSchedulePanel,
} from "../shells";

/* ────────────────────────────────────────────
   Main Orchestrator Preview
   ──────────────────────────────────────────── */
function OrchestratorPreview({
    id,
    name,
    source,
    description,
    tryHint,
    children,
}: {
    id: string;
    name: string;
    source: string;
    description: string;
    tryHint: string;
    children: React.ReactNode;
}) {
    return (
        <div id={id} className="scroll-mt-24">
            <div className="mb-4 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl font-black text-foreground tracking-tight">{name}</h3>
                    <code className="text-[11px] font-mono bg-muted px-2 py-0.5 rounded-md text-muted-foreground">
                        {source}
                    </code>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                    {description}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                    <span className="bg-primary/10 px-2 py-0.5 rounded-md">👆 Try</span>
                    <span className="text-muted-foreground font-medium">{tryHint}</span>
                </div>
            </div>
            <div className="flex justify-center">
                {children}
            </div>
        </div>
    );
}

/* ────────────────────────────────────────────
   Sub-component Preview (smaller, nested)
   ──────────────────────────────────────────── */
function SubComponentPreview({
    id,
    name,
    source,
    description,
    children,
}: {
    id: string;
    name: string;
    source: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <div id={id} className="scroll-mt-24">
            <div className="mb-3 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-foreground">{name}</h4>
                    <code className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground/70">
                        {source}
                    </code>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                    {description}
                </p>
            </div>
            <div className="flex justify-center">
                {children}
            </div>
        </div>
    );
}

/* ────────────────────────────────────────────
   "Built With" sub-component group
   ──────────────────────────────────────────── */
function BuiltWithGroup({ children }: { children: React.ReactNode }) {
    return (
        <div className="mt-8 ml-2 pl-6 border-l-2 border-primary/15 space-y-10">
            <div className="flex items-center gap-2 -ml-[27px]">
                <span className="h-3 w-3 rounded-full bg-primary/20 border-2 border-background" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Built With</span>
            </div>
            {children}
        </div>
    );
}

/* ════════════════════════════════════════════
   Component Showcase Section
   ════════════════════════════════════════════ */
export function ComponentShowcaseSection() {
    return (
        <section>
            <SectionHeading
                id="component-showcase"
                badge="17 Components"
                title="Component Architecture"
                description="Every component below is an interactive shell replica — same JSX, same state management, same event handlers, but with hardcoded data instead of API calls. This lets you evaluate the component architecture without needing credentials."
            />

            {/* ────────── Component Architecture Map ────────── */}
            <div className="mb-14 rounded-2xl border bg-card p-6">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Composition Map</h3>
                <p className="text-xs text-muted-foreground mb-5 max-w-xl">How the 17 components compose. 4 orchestrator components manage their children. Click any name to jump to its interactive preview.</p>
                <div className="grid sm:grid-cols-2 gap-6">
                    {/* Nav tree */}
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">Navigation Layer</p>
                        {[
                            { name: "LeftSidebar", anchor: "shell-left-sidebar", indent: 0 },
                            { name: "DashboardHeader", anchor: "shell-dashboard-header", indent: 0 },
                            { name: "RightSidebar", anchor: "shell-right-sidebar", indent: 0 },
                            { name: "EventCard", anchor: "shell-event-card", indent: 1 },
                            { name: "SchedulePanel", anchor: "shell-schedule-panel", indent: 1 },
                            { name: "CreateEventModal", anchor: "shell-create-event-modal", indent: 1 },
                            { name: "EventDetailModal", anchor: "shell-event-detail-modal", indent: 1 },
                        ].map(item => (
                            <a key={item.anchor} href={`#${item.anchor}`} className={`flex items-center gap-2 text-xs font-semibold hover:text-primary transition-colors ${item.indent ? "ml-6 text-muted-foreground" : "text-foreground"}`}>
                                {item.indent ? <span className="text-primary/30">└─</span> : <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                                {item.name}
                            </a>
                        ))}
                    </div>
                    {/* Chat tree */}
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">Chat Layer</p>
                        {[
                            { name: "ChatInterface", anchor: "shell-chat-interface", indent: 0 },
                            { name: "ChatMessagesList", anchor: "shell-chat-messages-list", indent: 1 },
                            { name: "ChatInputForm", anchor: "shell-chat-input-form", indent: 1 },
                            { name: "MessageRenderer + Citations", anchor: "shell-message-renderer", indent: 1 },
                            { name: "StatsGrid", anchor: "shell-stats-grid", indent: 1 },
                            { name: "ScheduleCard", anchor: "shell-schedule-card", indent: 1 },
                            { name: "ToolStatus", anchor: "shell-tool-status", indent: 1 },
                            { name: "EventCreatedCard", anchor: "shell-event-created-card", indent: 1 },
                            { name: "EmailDraftCard", anchor: "shell-email-draft-card", indent: 1 },
                            { name: "ReschedulePickerModal", anchor: "shell-reschedule-picker-modal", indent: 1 },
                        ].map(item => (
                            <a key={item.anchor} href={`#${item.anchor}`} className={`flex items-center gap-2 text-xs font-semibold hover:text-primary transition-colors ${item.indent ? "ml-6 text-muted-foreground" : "text-foreground"}`}>
                                {item.indent ? <span className="text-primary/30">└─</span> : <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-20">

                {/* ═══════════════════════════════════════════════
                    ORCHESTRATOR 1: LeftSidebar
                   ═══════════════════════════════════════════════ */}
                <div className="space-y-3 mb-2">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Navigation Components</h3>
                    <div className="h-px bg-primary/20" />
                </div>

                <OrchestratorPreview
                    id="shell-left-sidebar"
                    name="LeftSidebar"
                    source="navigation/LeftSidebar.tsx"
                    description="Built on shadcn/ui Sidebar primitives. Gets user data from AuthProvider (React Context). The profile card at the bottom triggers a dropdown that calls Firebase signOut() then clears the HttpOnly session cookie."
                    tryHint="Click the profile card at the bottom to see the logout dropdown"
                >
                    <div className="h-[500px] overflow-hidden rounded-lg border border-border/30">
                        <ShellLeftSidebar />
                    </div>
                </OrchestratorPreview>

                {/* ═══════════════════════════════════════════════
                    ORCHESTRATOR 2: DashboardHeader
                   ═══════════════════════════════════════════════ */}
                <OrchestratorPreview
                    id="shell-dashboard-header"
                    name="DashboardHeader"
                    source="navigation/DashboardHeader.tsx"
                    description="Search filters events from useCalendar() context in real-time. History dropdown loads conversations from Firestore via useChatSession(). Selecting a history item restores the full message thread."
                    tryHint="Type in the search bar to filter events, then click the 🕐 icon for chat history"
                >
                    <div className="w-full overflow-visible rounded-lg border border-border/30 pb-80 relative">
                        <ShellDashboardHeader />
                    </div>
                </OrchestratorPreview>

                {/* ═══════════════════════════════════════════════
                    ORCHESTRATOR 3: RightSidebar (+ sub-components)
                   ═══════════════════════════════════════════════ */}
                <OrchestratorPreview
                    id="shell-right-sidebar"
                    name="RightSidebar"
                    source="navigation/RightSidebar.tsx"
                    description="Orchestrates 4 sub-components. Events come from useCalendar() context (same source as the chat). CreateEventModal calls CalendarService.createEvent() then triggers refetchEvents() to sync sidebar + chat. This shared-state pattern avoids prop drilling."
                    tryHint="Click ? for help, click any event for detail modal, click 'Schedule New' for create modal"
                >
                    <div className="h-[580px] overflow-hidden rounded-lg border border-border/30">
                        <ShellRightSidebar />
                    </div>
                </OrchestratorPreview>

                <BuiltWithGroup>
                    <SubComponentPreview
                        id="shell-event-card"
                        name="EventCard"
                        source="navigation/EventCard.tsx"
                        description="Renders from the GoogleCalendarEvent interface. Color mapping uses a deterministic hash of the event summary. Status badge logic: if start < now < end → 'In Progress', if start > now → 'Upcoming'."
                    >
                        <ShellEventCard />
                    </SubComponentPreview>

                    <SubComponentPreview
                        id="shell-schedule-panel"
                        name="SchedulePanel"
                        source="navigation/SchedulePanel.tsx"
                        description="Groups events by date using date-fns formatRelative(). 'Today' filter vs. 'View All' is a local state toggle — not a re-fetch. Keeps API calls minimal."
                    >
                        <ShellSchedulePanel />
                    </SubComponentPreview>

                    <SubComponentPreview
                        id="shell-create-event-modal"
                        name="CreateEventModal"
                        source="navigation/CreateEventModal.tsx"
                        description="Controlled form with useState for each field. Google Meet toggle sets conferenceData in the Calendar API payload. Guest emails are comma-split and mapped to attendees[]. On submit, calls CalendarService.createEvent() then refetchEvents()."
                    >
                        <ShellCreateEventModal />
                    </SubComponentPreview>

                    <SubComponentPreview
                        id="shell-event-detail-modal"
                        name="EventDetailModal"
                        source="navigation/EventDetailModal.tsx"
                        description="Reads from GoogleCalendarEvent type. RSVP status comes from attendees[].responseStatus (accepted/declined/tentative). Google Calendar link is constructed from event.htmlLink."
                    >
                        <ShellEventDetailModal />
                    </SubComponentPreview>
                </BuiltWithGroup>

                {/* ═══════════════════════════════════════════════
                    ORCHESTRATOR 4: ChatInterface (+ sub-components)
                   ═══════════════════════════════════════════════ */}
                <div className="space-y-3 mb-2 pt-8">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Chat Components</h3>
                    <div className="h-px bg-primary/20" />
                </div>

                <OrchestratorPreview
                    id="shell-chat-interface"
                    name="ChatInterface"
                    source="chat/ChatInterface.tsx"
                    description="The main orchestrator. useChat() from AI SDK v6 handles streaming, message state, and tool call lifecycle. On each AI response, tool invocations are logged to Firestore. The full thread is persisted on a debounced interval. Quick action chips inject context-aware prompts using live calendar data from useCalendar()."
                    tryHint="Type a message and press Enter to send. Click quick action chips to see context-aware prompts. Click [[citations]] to see event details."
                >
                    <div className="w-full h-[560px] overflow-hidden rounded-lg border border-border/30 bg-muted/30">
                        <ShellChatInterface />
                    </div>
                </OrchestratorPreview>

                <BuiltWithGroup>
                    <SubComponentPreview
                        id="shell-chat-messages-list"
                        name="ChatMessagesList"
                        source="chat/ChatMessagesList.tsx"
                        description="Maps over useChat() messages array. Each message checks for toolInvocations to render ToolStatus pills, then passes content to MessageRenderer for widget injection and citation parsing."
                    >
                        <div className="w-full overflow-visible rounded-lg border border-border/30 bg-background">
                            <ShellChatMessagesList />
                        </div>
                    </SubComponentPreview>

                    <SubComponentPreview
                        id="shell-chat-input-form"
                        name="ChatInputForm"
                        source="chat/ChatInputForm.tsx"
                        description="Textarea auto-resizes via scrollHeight. Quick action chips read from useCalendar() to inject real event names into prompt templates ('Reschedule {nextEvent}', 'Summarize today')."
                    >
                        <ShellChatInputForm />
                    </SubComponentPreview>

                    <SubComponentPreview
                        id="shell-message-renderer"
                        name="MessageRenderer + Citations"
                        source="chat/MessageRenderer.tsx"
                        description="Content pipeline: split by newlines → regex for **bold** and [[citations]] → detect [WIDGET: X] markers → swap for React components. Citations open a detail popup. No dangerouslySetInnerHTML — all parsed to React elements."
                    >
                        <div className="overflow-visible pb-40">
                            <ShellMessageRenderer />
                        </div>
                    </SubComponentPreview>

                    <SubComponentPreview
                        id="shell-stats-grid"
                        name="StatsGrid"
                        source="chat/StatsGrid.tsx"
                        description="Computed from the events array in useCalendar(). Meeting count = events.length, focus hours = gaps between events calculated with date-fns differenceInHours(). Rendered when MessageRenderer detects [WIDGET: STATS]."
                    >
                        <ShellStatsGrid />
                    </SubComponentPreview>

                    <SubComponentPreview
                        id="shell-schedule-card"
                        name="ScheduleCard"
                        source="chat/ScheduleCard.tsx"
                        description="Shows next 3 events from useCalendar() context. Triggered by [WIDGET: SCHEDULE] marker in AI output. Time formatting uses date-fns format() with custom patterns."
                    >
                        <ShellScheduleCard />
                    </SubComponentPreview>

                    <SubComponentPreview
                        id="shell-tool-status"
                        name="ToolStatus"
                        source="chat/ToolStatus.tsx"
                        description="Renders based on toolInvocation.state from AI SDK v6 — 'partial-call' shows spinner, 'result' shows checkmark + tool name. Maps tool IDs to human-readable labels."
                    >
                        <ShellToolStatus />
                    </SubComponentPreview>

                    <SubComponentPreview
                        id="shell-event-created-card"
                        name="EventCreatedCard"
                        source="chat/EventCreatedCard.tsx"
                        description="Rendered when create_event tool returns a result. Extracts summary, start/end, attendees, and hangoutLink from the Google Calendar API response object."
                    >
                        <ShellEventCreatedCard />
                    </SubComponentPreview>

                    <SubComponentPreview
                        id="shell-email-draft-card"
                        name="EmailDraftCard"
                        source="chat/EmailDraftCard.tsx"
                        description="3 action states: View (read-only) → Edit (contentEditable fields) → Send (POST to /api/gmail/send). Copy uses navigator.clipboard.writeText(). All state managed with useState, no form library."
                    >
                        <ShellEmailDraftCard />
                    </SubComponentPreview>

                    <SubComponentPreview
                        id="shell-reschedule-picker-modal"
                        name="ReschedulePickerModal"
                        source="chat/ReschedulePickerModal.tsx"
                        description="Reads events from useCalendar() context. On event click, constructs a prompt string ('Reschedule {eventName} to...') and injects it into the chat input. The AI handles the actual delete + recreate."
                    >
                        <ShellReschedulePickerModal />
                    </SubComponentPreview>
                </BuiltWithGroup>
            </div>
        </section>
    );
}
