import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkRateLimit, rateLimitResponse } from '../rate-limit';

describe('Rate Limiter', () => {
    beforeEach(() => {
        // Reset timers and module state before each test
        vi.useFakeTimers();
    });

    const config = { maxRequests: 5, windowSeconds: 60 };

    it('allows requests under the limit', () => {
        // Fake IP 1 makes 5 requests
        for (let i = 0; i < 5; i++) {
            const result = checkRateLimit('user_ip_1', config);
            expect(result.allowed).toBe(true);
            expect(result.remaining).toBe(4 - i);
        }
    });

    it('blocks requests over the limit and calculates reset correctly', () => {
        // Fill up the quota
        for (let i = 0; i < 5; i++) {
            checkRateLimit('user_ip_2', config);
        }

        // 6th request should be blocked
        const result = checkRateLimit('user_ip_2', config);
        expect(result.allowed).toBe(false);
        expect(result.remaining).toBe(0);
        expect(result.resetInSeconds).toBeGreaterThan(0);
        expect(result.resetInSeconds).toBeLessThanOrEqual(60);
    });

    it('allows requests again after the time window passes', () => {
        // Fill up the quota
        for (let i = 0; i < 5; i++) {
            checkRateLimit('user_ip_3', config);
        }

        // Blocked
        expect(checkRateLimit('user_ip_3', config).allowed).toBe(false);

        // Fast-forward time past the 60s window
        vi.advanceTimersByTime(61 * 1000);

        // Should be allowed again
        const resultAfterWait = checkRateLimit('user_ip_3', config);
        expect(resultAfterWait.allowed).toBe(true);
        expect(resultAfterWait.remaining).toBe(4);
    });

    it('generates a proper 429 response object', () => {
        const response = rateLimitResponse(45);
        expect(response.status).toBe(429);
        expect(response.headers.get('Retry-After')).toBe('45');
        expect(response.headers.get('X-RateLimit-Reset')).toBe('45');
    });
});
