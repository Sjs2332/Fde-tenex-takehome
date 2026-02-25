# Tenex Intelligence — Video Script
# Target: < 10 minutes. Be natural, not robotic. This is a guide, not a teleprompter.

---

## INTRO (30 seconds)
"Hey, I'm [Name]. I built Tenex Intelligence — an AI-powered Chief of Staff 
that connects to your Google Calendar and lets you manage your entire 
schedule through natural language. I'll walk you through what I built, 
the architecture decisions, and why I made them."

---

## DEMO — SHOW THE APP (3-4 minutes)

### 1. Landing Page → Login (15 sec)
- Show the landing page briefly
- Click "Sign in with Google"
- "Authentication goes through Firebase with Google OAuth. I'm requesting 
  Calendar and Gmail scopes so the AI can actually operate on your real data."

### 2. Dashboard Overview (20 sec)
- Point out the three-panel layout
- Left: navigation + user menu
- Center: AI chat
- Right: live calendar with event timeline
- "The right sidebar is pulling live events from Google Calendar. 
  This syncs in real-time — when the AI creates or deletes an event, 
  the sidebar updates instantly without a page refresh."

### 3. Search Bar (10 sec)
- Click the search bar in the header
- Show events dropdown appearing
- Type to filter
- "The search bar shows your upcoming events on focus and filters as you type."

### 4. AI Chat — Schedule Something (45 sec)
- Type: "Schedule a 30 minute meeting with dan@tenex.co tomorrow at 2pm"
- Show the tool status pills: "Checking your calendar..." → "Calendar data loaded"
  then "Creating event..." → "Event created ✓"
- "The AI doesn't just generate text — it has real Google Calendar API tools.
  Watch the tool status indicators. First it fetches events to check for 
  conflicts, then creates the event. This is a real event on my calendar."
- Point out the Event Created card with the Google Meet link
- Show the sidebar updated with the new event

### 5. Quick Actions (30 sec)
- Click "Summarize week"
- Show the stats widget rendering inline
- "Quick actions generate contextual prompts. Notice the stats dashboard 
  appeared automatically — the AI includes invisible widget markers that 
  the UI detects and renders as interactive components. The user never 
  sees any technical markup."

### 6. Audit Meetings (20 sec)
- Click "Audit meetings"
- Show the schedule widget appearing
- "Same pattern here — the schedule timeline widget appears inline.
  The AI gives concrete recommendations: which meetings to shorten, 
  which could be emails."

### 7. Reschedule Flow (30 sec)
- Click "Reschedule sync"
- Show the meeting picker modal
- Pick a meeting
- Show the AI deleting the old event and creating a new one
- "Rescheduling is a two-step operation: delete the old event, 
  then create a new one. The AI handles both. The old slot is 
  freed up on the calendar."

### 8. Draft Email (20 sec)
- Click "Draft email"
- The chat shows "Draft an email for me" — simple, natural
- Show the AI responding by asking who it's to and what about
- Answer with a recipient and topic
- Show the email draft card rendered with Edit / Copy / Send buttons
- "Notice I didn't tell the AI to ask me questions — it just knows.
  The system prompt handles that. And the Send button actually
  sends via the Gmail API. It's not a mock."

### 9. Chat History & Persistence (15 sec)
- Point to the Header buttons
- Open the "History" dropdown to show recent chats
- Click "New Chat" to show it clears the slate
- "Every conversation is auto-saved to Firestore. If I refresh 
  the page, it loads the active thread and doesn't wipe my state. 
  I can seamlessly jump back into old contexts."

### 10. Citations (10 sec)
- Point out [[Event Name]] buttons in an AI response
- Click one to open the event detail modal
- "Event names in AI responses are clickable citations — 
  they open a detail modal with attendees, time, and video call link."

---

## ARCHITECTURE DEEP DIVE (3-4 minutes)

### 1. Show the File Structure (30 sec)
Open the `src/` folder in your editor.
"The codebase is 58 source files, fully modular. Let me walk through 
the key decisions."

### 2. API Route — Show route.ts (30 sec)
Open `src/app/api/chat/route.ts`
"The API route is just over 70 lines. All it does is orchestration —  
token reading, and streaming. The tools and system prompt are imported 
from separate modules."

### 3. AI Tools — Show tools.ts (30 sec)
Open `src/lib/ai/tools.ts`
"Three tools: get_events, create_event, delete_event. They're created 
via a factory function that captures the user's Google token in a closure. 
The token never touches the LLM — it's completely isolated.

All Google API calls go through a single fetch helper with built-in 
retry logic — up to 2 retries with exponential backoff. Server errors 
and rate limits get retried automatically; client errors fail fast."

### 4. Security — Show token-manager.ts + next.config.ts (45 sec)
Open `src/lib/auth/token-manager.ts`
"Google access tokens are stored in HttpOnly cookies — JavaScript 
can't access them. This prevents XSS token theft."

Open `next.config.ts`
"I have a full Content Security Policy: whitelisted origins for scripts, 
styles, API connections. Plus HSTS and X-Frame-Options to prevent 
clickjacking and enforcement of secure connections."

### 5. Firebase Integration — Show services folder (30 sec)
Open `src/lib/services/firebase/`
"Four Firebase services:
- users.ts — captures Google profile data on every login
- conversations.ts — auto-saves chat history  
- activity.ts — logs every agent action: calendar fetches, 
  event creates, deletes, email sends
- auth.ts — handles the OAuth flow

All user-scoped with Firestore security rules. User A 
can never read User B's data."

### 6. Shared State & Contexts (30 sec)
Open `src/hooks/use-calendar.tsx` and `use-chat-session.tsx`
"Two main contexts wrap the app:
1. CalendarProvider — shares event state between sidebar and chat so mutative AI actions update everything instantly.
2. ChatSessionProvider — manages the cross-session active conversation ID and handles fetching thread history from Firestore on page load."

### 7. System Prompt — Show system-prompt.ts (20 sec)
Open `src/lib/ai/system-prompt.ts`
"The system prompt has a temporal anchor — the current timestamp — 
so the AI can do accurate date math. It has mandatory conflict 
checking, a rescheduling protocol, and invisible widget triggers. 
The AI auto-appends widget markers that the UI strips and renders 
as interactive components."

---

## TRADE-OFFS & NEXT STEPS (1-2 minutes)

"A few honest trade-offs:

1. Token refresh — Google tokens expire in an hour. Right now it 
   requires re-login. Production fix: server-side OAuth refresh 
   tokens.

2. The app is deeply coupled to Google. Using abstract interfaces
   (e.g., `CalendarInterface`) would make it easier to add Outlook
   support later.

Next steps if I had more time:
- Better loading states or optimistic UI for calendar deletions
- Activity dashboard — the audit trail is being collected, 
  could surface it as a usage analytics page
- Multi-calendar support — currently primary calendar only
- Recurring event intelligence — detect patterns and suggest 
  batch optimizations"

---

## CLOSING (15 seconds)
"That's Tenex Intelligence. Real calendar integration, production 
security, and an AI agent that actually operates on your data — 
not a demo. Thanks for watching."

---

## TIPS FOR RECORDING

1. Have the app running at localhost:3000 before you start
2. Have your editor open to src/ so you can quickly navigate
3. Do the demo portion FIRST while the energy is high
4. Be yourself — they said "no scripts, be yourself"
5. Use this as a GUIDE, not a teleprompter. Know the beats,
   speak naturally
6. If something breaks during the demo, don't panic — address it. 
   That's more authentic than a perfect run.
7. Keep it under 10 minutes. Aim for 8.
