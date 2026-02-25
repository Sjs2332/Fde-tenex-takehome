# Tenex Intelligence

An AI-powered Chief of Staff that manages your Google Calendar with real-time scheduling, conflict detection, and natural language commands.

---

## Features

- **AI Calendar Agent** — Natural language scheduling powered by GPT-4o-mini with live Google Calendar API tools (`get_events`, `create_event`, `delete_event`)
- **Conflict Detection** — Mandatory pre-check before every event creation; suggests alternatives when conflicts exist
- **Smart Rescheduling** — Delete old event + create new in one flow; sidebar updates in real-time
- **Email Drafting** — AI asks who and what, then generates a professional draft with one-click Gmail send
- **Interactive Widgets** — Stats dashboard, schedule timeline, and event cards auto-rendered inline (AI triggers them invisibly)
- **Calendar Citations** — Event names in AI responses become clickable buttons that open event details
- **User Profiles** — Google OAuth data (name, email, photo) persisted to Firestore on every login
- **Activity Logging** — Every agent action (creates, deletes, fetches, emails) persisted to Firestore
- **Conversation History** — Seamless persistence: threads auto-save to Firestore, persist across page reloads, and can be browsed/resumed via the Header's History dropdown
- **Event Search** — Header search bar shows and filters upcoming events in real-time
- **Quick Actions** — One-click chips: Draft Email, Reschedule (with meeting picker), Summarize Week, Audit Meetings

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router, Turbopack) |
| AI | Vercel AI SDK v6, OpenAI GPT-4o-mini |
| Auth | Firebase Auth (Google OAuth) |
| Database | Cloud Firestore |
| Styling | Tailwind CSS 4, shadcn/ui |
| APIs | Google Calendar API, Gmail API |
| Language | TypeScript 5, React 19 |

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── auth/session/route.ts      # HttpOnly cookie token management
│   │   └── chat/route.ts              # AI chat endpoint (70 lines)
│   ├── app/
│   │   ├── layout.tsx                 # CalendarProvider + SidebarProvider
│   │   └── page.tsx                   # Dashboard with ChatInterface
│   ├── layout.tsx                     # Root layout, fonts, AuthProvider
│   └── page.tsx                       # Landing page
├── components/
│   ├── app/
│   │   ├── chat/                  # Modular chat system (Input, Messages, Actions)
│   │   └── navigation/            # Headers, Sidebars, Modals 
│   ├── providers/                 # Cross-cutting React Context (Auth)
│   └── ui/                        # Isolated shadcn primitive components
├── hooks/                         # Typed data management hooks (Calendar, Chat History)
├── lib/
│   ├── ai/                        # Server-side AI System Prompt & Tool Executions
│   ├── auth/                      # Server-side token extraction 
│   ├── services/                  # Firebase Firestore typed CRUD 
│   └── utils.ts
└── types/                         # Global Typescript interfaces
```

## Security

### Implemented Protections

| Protection | Implementation |
|---|---|
| **HttpOnly Token Storage** | Google access tokens stored in server-only HttpOnly cookies (`lib/auth/token-manager.ts`), not accessible via JavaScript |
| **Content Security Policy** | Strict CSP headers in `next.config.ts` — whitelisted origins for scripts, styles, fonts, images, and API connections |
| **HSTS** | Strict-Transport-Security with 2-year max-age, including subdomains |
| **XSS Prevention** | X-XSS-Protection, X-Content-Type-Options: nosniff |
| **Clickjacking Protection** | X-Frame-Options: SAMEORIGIN, frame-ancestors: self |
| **Input Validation** | Request body validation in API routes; typed error responses |
| **Firestore Security Rules** | User-scoped access only (`request.auth.uid == userId`); deny-all default |
| **Token Isolation** | Google tokens never sent to the LLM; captured in server-side closure |
| **API Retry Logic** | Google API calls retry up to 2x with exponential backoff (500ms, 1500ms) on 5xx/429 errors |
| **Server-Side Proxy** | All Google API calls (Calendar, Gmail) proxy through Next.js routes; tokens never expose to client |
| **Referrer Policy** | strict-origin-when-cross-origin |
| **Permissions Policy** | Camera, microphone, geolocation disabled |

### Known Limitations

- **Token refresh**: Google access tokens expire after 1 hour. Currently requires re-login. Production enhancement: implement server-side OAuth refresh token flow.

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Authentication and Firestore enabled
- Google Cloud project with Calendar and Gmail APIs enabled
- OpenAI API key

### Setup

```bash
# Clone
git clone https://github.com/Sjs2332/Fde-tenex-takehome.git
cd Fde-tenex-takehome

# Install
npm install

# Configure environment
cp .env.example .env
# Fill in your Firebase config and OpenAI API key

# Run
npm run dev
```

### Firebase Setup

1. Enable **Google** sign-in in Firebase Auth
2. Create a **Firestore** database
3. Apply the security rules from `FIREBASE_SCHEMA.md`
4. Enable **Calendar API** and **Gmail API** in Google Cloud Console
5. Add `http://localhost:3000` to your Firebase authorized domains

## Firestore Schema

See [`FIREBASE_SCHEMA.md`](./FIREBASE_SCHEMA.md) for the complete schema design, security rules, and required indexes.

## License

Private — take-home project for FDE.
