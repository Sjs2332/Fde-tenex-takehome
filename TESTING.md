# Unit Tests Documentation

To ensure production-level reliability, we have implemented automated unit tests covering critical utility functions and security mechanisms. The tests are written using standard Node.js native testing via `vitest`.

## Test Suites

### 1. Rate Limiting (`src/lib/__tests__/rate-limit.test.ts`)
Validates the custom sliding-window rate limiter designed to protect the OpenAI API and server resources from abuse.

**Tested Behaviors:**
- ✅ **Standard Allowed Flow**: Confirms that normal traffic beneath the configured threshold is allowed through and properly returns remaining token counts.
- ✅ **Limit Enforcement**: Verifies that when a client exceeds the threshold (e.g., 30 requests per minute), subsequent requests are blocked, returning `allowed: false` along with the correct `resetInSeconds` delay.
- ✅ **Window Resetting**: Manipulates simulated timers to fast-forward past the rate-limit window, proving that previously blocked clients are unblocked once their time window clears.
- ✅ **HTTP Response Formatting**: Validates that `rateLimitResponse()` generates a perfectly formatted HTTP 429 Too Many Requests response, complete with correct `Retry-After` and `X-RateLimit-Reset` headers.

### 2. Calendar Utilities (`src/lib/__tests__/calendar-utils.test.ts`)
Validates the pure functions that drive the temporal reasoning and UI state for calendar events.

**Tested Behaviors:**
- ✅ **Event Status Classification (`getEventStatus`)**: Uses fake system timers to definitively test the classification logic. Accurately categorizes events into `"upcoming"`, `"soon"`, `"in-progress"`, and `"done"`.
- ✅ **Human-Readable Timestamps (`getTimeUntilLabel`)**: Verifies formatting logic converting raw MS diffs into strings like `"in 30 min"`, `"in 4 hr"`, or `"in 2 days"`. Verifies that past events properly return `null`.

## How to Run Tests

To execute the test suite locally:

```bash
npm run test
```

*Note: The test suite runs in isolation without needing Firebase emulation or a live Google connection, as it specifically targets pure business logic.*
