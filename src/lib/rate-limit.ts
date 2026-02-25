/**
 * In-memory sliding-window rate limiter.
 *
 * Protects the OpenAI API endpoint from abuse. Tracks requests per identifier
 * (IP address) within a configurable time window. Process-local — suitable for
 * single-server or Vercel Serverless (per-isolate). For distributed deployments,
 * swap this for Upstash Redis.
 */

interface RateLimitEntry {
    timestamps: number[];
}

interface RateLimitConfig {
    maxRequests: number;
    windowSeconds: number;
}

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetInSeconds: number;
}

const store = new Map<string, RateLimitEntry>();

// Auto-cleanup stale entries every 60 seconds to prevent memory leaks
const CLEANUP_INTERVAL_MS = 60_000;

let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup(windowMs: number) {
    if (cleanupTimer) return;
    cleanupTimer = setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of store) {
            entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
            if (entry.timestamps.length === 0) store.delete(key);
        }
    }, CLEANUP_INTERVAL_MS);

    // Allow Node to exit even if this timer is running
    if (typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
        cleanupTimer.unref();
    }
}

/**
 * Checks whether a given identifier (e.g. IP) is within the rate limit.
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): RateLimitResult {
    const windowMs = config.windowSeconds * 1000;
    const now = Date.now();

    startCleanup(windowMs);

    let entry = store.get(identifier);
    if (!entry) {
        entry = { timestamps: [] };
        store.set(identifier, entry);
    }

    // Remove timestamps outside the current window
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

    if (entry.timestamps.length >= config.maxRequests) {
        const oldestInWindow = entry.timestamps[0];
        const resetInSeconds = Math.ceil((oldestInWindow + windowMs - now) / 1000);
        return {
            allowed: false,
            remaining: 0,
            resetInSeconds: Math.max(resetInSeconds, 1),
        };
    }

    entry.timestamps.push(now);
    return {
        allowed: true,
        remaining: config.maxRequests - entry.timestamps.length,
        resetInSeconds: Math.ceil(windowMs / 1000),
    };
}

/**
 * Returns a 429 Response with standard rate-limit headers.
 */
export function rateLimitResponse(resetInSeconds: number): Response {
    return new Response(
        JSON.stringify({
            error: "Too many requests. Please slow down.",
            retryAfterSeconds: resetInSeconds,
        }),
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
