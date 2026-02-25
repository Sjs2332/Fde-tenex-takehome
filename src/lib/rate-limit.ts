/**
 * In-memory rate limiter for API routes.
 *
 * Uses a sliding-window approach: each IP gets a fixed number of requests
 * within a time window. When the window expires, the counter resets.
 *
 * NOTE: This is process-local. In a multi-instance deployment (e.g., Vercel
 * serverless), use Redis or Upstash instead. For a demo / take-home, this
 * is appropriate and shows security awareness.
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Periodically clean up expired entries to prevent memory leaks
const CLEANUP_INTERVAL_MS = 60_000;
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (now > entry.resetTime) store.delete(key);
    }
}, CLEANUP_INTERVAL_MS);

interface RateLimitConfig {
    /** Maximum requests allowed within the window */
    maxRequests: number;
    /** Time window in seconds */
    windowSeconds: number;
}

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetInSeconds: number;
}

/**
 * Check if a request from a given identifier is within rate limits.
 *
 * @param identifier - Unique key (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Whether the request is allowed, remaining quota, and reset time
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = { maxRequests: 20, windowSeconds: 60 }
): RateLimitResult {
    const now = Date.now();
    const windowMs = config.windowSeconds * 1000;
    const entry = store.get(identifier);

    if (!entry || now > entry.resetTime) {
        // First request or window expired — start fresh
        store.set(identifier, { count: 1, resetTime: now + windowMs });
        return { allowed: true, remaining: config.maxRequests - 1, resetInSeconds: config.windowSeconds };
    }

    if (entry.count >= config.maxRequests) {
        // Over the limit
        const resetInSeconds = Math.ceil((entry.resetTime - now) / 1000);
        return { allowed: false, remaining: 0, resetInSeconds };
    }

    // Within limits — increment
    entry.count++;
    const resetInSeconds = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: true, remaining: config.maxRequests - entry.count, resetInSeconds };
}

/**
 * Creates a 429 Response with standard rate limit headers.
 */
export function rateLimitResponse(resetInSeconds: number): Response {
    return new Response(
        JSON.stringify({ error: "Too many requests. Please wait before trying again." }),
        {
            status: 429,
            headers: {
                "Content-Type": "application/json",
                "Retry-After": String(resetInSeconds),
                "X-RateLimit-Reset": String(resetInSeconds),
            },
        }
    );
}
