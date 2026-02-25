# Firebase Schema Design

## Overview

Firestore schema for Tenex Intelligence. The app uses Firebase Authentication
(Google OAuth) and Firestore to persist conversations, activity logs, and
user analytics.

---

## Collections

### `users/{userId}`

Auto-populated from Google OAuth on every login via `UserService.upsertOnLogin()`.
`createdAt` is set only on first login; `lastLoginAt` updates every time.

```
users/
  {userId}/
    ├── displayName: string
    ├── email: string
    ├── photoURL: string | null
    ├── createdAt: Timestamp
    ├── lastLoginAt: Timestamp
    └── preferences/
        ├── defaultMeetingDuration: number     // minutes, default 30
        ├── workingHoursStart: string          // "09:00"
        ├── workingHoursEnd: string            // "18:00"
        ├── timezone: string                   // "America/New_York"
        └── bufferMinutes: number              // default 10
```

### `users/{userId}/conversations/{conversationId}`

Stores chat history per conversation thread.

```
conversations/
  {conversationId}/
    ├── title: string                          // Auto-generated from first message
    ├── createdAt: Timestamp
    ├── updatedAt: Timestamp
    ├── messageCount: number
    └── messages/                              // Subcollection
        {messageId}/
          ├── role: "user" | "assistant"
          ├── content: string                  // Raw text content
          └── createdAt: Timestamp
```

### `users/{userId}/activity/{activityId}`

Logs every agent action. Used for audit trail and analytics.

```
activity/
  {activityId}/                                // Auto-generated ID
    ├── type: string                           // "event_created" | "event_deleted" |
    │                                          // "calendar_fetch" | "email_sent" |
    │                                          // "email_drafted" | "event_rescheduled"
    ├── summary: string                        // Human-readable: "Created event: Standup"
    ├── metadata: {                            // Tool-specific data
    │     toolName: string
    │     output: Record<string, any>          // Full tool output
    │     to?: string                          // For emails
    │     subject?: string                     // For emails
    │   }
    └── createdAt: Timestamp
```

### `users/{userId}/analytics/{weekId}`

Weekly aggregated analytics for the Stats Dashboard.

```
analytics/
  {weekId}/                                    // Format: "2026-W09"
    ├── totalMeetingMinutes: number
    ├── totalEvents: number
    ├── focusHoursAvailable: number
    ├── busiestDay: string                     // "Monday"
    ├── topAttendees: Array<{email, count}>
    ├── suggestedCuts: Array<{eventTitle, reason}>
    └── computedAt: Timestamp
```

---

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /conversations/{conversationId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;

        match /messages/{messageId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }

      match /activity/{activityId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /analytics/{weekId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Indexes

Required composite indexes for common queries:

1. `users/{userId}/conversations` — `updatedAt DESC` (for listing recent chats)
2. `users/{userId}/conversations/{id}/messages` — `createdAt ASC` (for chat history)
3. `users/{userId}/activity` — `createdAt DESC` (for recent activity feed)
4. `users/{userId}/activity` — `type ASC, createdAt DESC` (for filtering by action type)
5. `users/{userId}/analytics` — `computedAt DESC` (for dashboard)

---

## Notes

- **No sensitive tokens in Firestore**: Google access tokens are stored in
  HttpOnly cookies (server-side) and NEVER written to Firestore.
- **Subcollections over arrays**: Messages are a subcollection (not an array)
  to avoid the 1MB document limit and enable pagination.
- **Activity log is append-only**: Actions are never updated or deleted.
  This creates a reliable audit trail.
- **Week ID format**: `YYYY-Www` (ISO 8601 week numbering) makes range queries
  simple and human-readable.
