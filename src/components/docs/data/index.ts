export const features = [
    {
        icon: "🤖",
        title: "AI Calendar Agent",
        desc: "GPT-4o-mini with 3 tool definitions (get_events, create_event, delete_event). Uses Vercel AI SDK v6 streamText() with stepCountIs(5) to cap multi-step loops. System prompt injects live EST timestamp so the model resolves relative dates.",
    },
    {
        icon: "⚡",
        title: "Conflict Detection",
        desc: "System prompt mandates get_events before every create_event — no exceptions. The AI checks for overlaps and suggests alternatives. This was a deliberate prompt-engineering choice vs. a code-level guard.",
    },
    {
        icon: "🔄",
        title: "Smart Rescheduling",
        desc: "Delete + create in one streamed turn. The useCalendar() hook triggers refetchEvents() on tool completion so the RightSidebar updates without a page reload. React Context keeps sidebar and chat in sync.",
    },
    {
        icon: "✉️",
        title: "Email Drafting",
        desc: "AI generates the draft inline, EmailDraftCard renders editable fields. 'Send' calls /api/gmail/send which proxies through the server — the Google token never touches the client or the LLM context.",
    },
    {
        icon: "📊",
        title: "Inline Widget System",
        desc: "The AI outputs invisible markers like [WIDGET: STATS] in its response. MessageRenderer detects these markers and swaps them for React components (StatsGrid, ScheduleCard). Zero iframe or embed overhead.",
    },
    {
        icon: "🔗",
        title: "Calendar Citations",
        desc: "When the AI references events, it wraps names in [[brackets]]. MessageRenderer splits on a regex, renders CitationButton components. Clicking opens an event detail popup — no page navigation needed.",
    },
    {
        icon: "💾",
        title: "Conversation Persistence",
        desc: "Threads auto-save to Firestore with a debounced single-write approach. The History dropdown in DashboardHeader loads past conversations. Each thread gets a UUID-based conversationId via useChatSession().",
    },
    {
        icon: "📋",
        title: "Activity Audit Trail",
        desc: "Every tool invocation (create, delete, fetch, email send) is logged to a Firestore subcollection under the user. This was added as a reviewability feature — you can see exactly what the agent did.",
    },
];

export const techStack = [
    { layer: "Framework", tech: "Next.js 16 (App Router, Turbopack)" },
    { layer: "AI", tech: "Vercel AI SDK v6, OpenAI GPT-4o-mini" },
    { layer: "Auth", tech: "Firebase Auth (Google OAuth)" },
    { layer: "Database", tech: "Cloud Firestore" },
    { layer: "Styling", tech: "Tailwind CSS 4, shadcn/ui" },
    { layer: "APIs", tech: "Google Calendar API, Gmail API" },
    { layer: "Language", tech: "TypeScript 5, React 19" },
    { layer: "Testing", tech: "Vitest, React Testing Library, jsdom" },
];

export const apiEndpoints = [
    {
        method: "POST",
        path: "/api/auth/session",
        desc: "Receives Google access token from client, writes it to an HttpOnly cookie. This is the only time the token crosses the network — after this, it lives server-side only.",
    },
    {
        method: "DELETE",
        path: "/api/auth/session",
        desc: "Clears the HttpOnly session cookie. Client calls this on logout before Firebase signOut().",
    },
    {
        method: "GET",
        path: "/api/calendar",
        desc: "Server-side proxy to Google Calendar API. Reads token from cookie, fetches events, returns JSON. The client never sees the Google token.",
    },
    {
        method: "POST",
        path: "/api/calendar",
        desc: "Handles create and delete operations. Action is specified in the request body. Same token isolation pattern as GET.",
    },
    {
        method: "POST",
        path: "/api/chat",
        desc: "The core AI endpoint. Calls streamText() with tool definitions that have the Google token captured in a closure — the LLM never sees it. Returns a UI message stream via toUIMessageStreamResponse().",
    },
    {
        method: "POST",
        path: "/api/gmail/send",
        desc: "Proxies Gmail send through the server. Token read from cookie, email sent via Gmail API, response returned. Added for the email drafting feature.",
    },
];

export const securityItems = [
    {
        label: "HttpOnly Token Storage",
        desc: "Google access tokens stored in HttpOnly cookies — inaccessible to client-side JavaScript. Set in /api/auth/session, read by all other API routes.",
    },
    {
        label: "Content Security Policy",
        desc: "Custom CSP header in next.config.ts whitelisting only googleapis.com, firebase, and Google Fonts. Blocks all other script/connect origins.",
    },
    {
        label: "Token Isolation from LLM",
        desc: "The Google token is captured in a server-side closure when creating tool functions. The AI SDK passes tool definitions to GPT-4o-mini, but the token is never part of the prompt or message context.",
    },
    {
        label: "Server-Side Proxy",
        desc: "All Google API calls route through Next.js API routes. This means the browser never makes direct requests to googleapis.com with credentials.",
    },
    {
        label: "Rate Limiting",
        desc: "Custom sliding-window rate limiter (30 req/min/IP) protects the /api/chat endpoint. Implemented in-memory with a Map — no external dependency needed for this scale.",
    },
    {
        label: "Firestore Security Rules",
        desc: "All Firestore paths require request.auth.uid == userId. Deny-all default. Users can only read/write their own conversations and activity logs.",
    },
    {
        label: "Input Validation",
        desc: "Every API route validates the request body before processing. Typed JSON error responses with appropriate HTTP status codes (400, 401, 500).",
    },
    {
        label: "Security Headers",
        desc: "HSTS (2-year max-age), X-Frame-Options SAMEORIGIN, X-Content-Type-Options nosniff, Permissions-Policy disabling camera/mic/geo. All set in next.config.ts headers().",
    },
];

export const navItems = [
    { id: "features", label: "Features" },
    { id: "component-showcase", label: "Components" },
    { id: "architecture", label: "Architecture" },
    { id: "tech-stack", label: "Tech Stack" },
    { id: "api-reference", label: "API Reference" },
    { id: "security", label: "Security" },
    { id: "getting-started", label: "Getting Started" },
];
