import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getEventStatus, getTimeUntilLabel } from '../calendar-utils';
import { GoogleCalendarEvent } from '@/types/google/calendar';

describe('Calendar Utils', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        // Set fixed date for reproducible tests
        vi.setSystemTime(new Date('2026-02-24T12:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const createMockEvent = (startIso: string, endIso?: string): GoogleCalendarEvent => ({
        id: 'test',
        summary: 'test',
        start: { dateTime: startIso },
        end: endIso ? { dateTime: endIso } : {},
    });

    describe('getEventStatus', () => {
        it('identifies upcoming events (>60 mins from now)', () => {
            const event = createMockEvent('2026-02-24T14:00:00Z', '2026-02-24T15:00:00Z');
            expect(getEventStatus(event)).toBe('upcoming');
        });

        it('identifies soon events (<=60 mins from now)', () => {
            const event = createMockEvent('2026-02-24T12:30:00Z', '2026-02-24T13:00:00Z');
            expect(getEventStatus(event)).toBe('soon');
        });

        it('identifies in-progress events', () => {
            const event = createMockEvent('2026-02-24T11:30:00Z', '2026-02-24T12:30:00Z');
            expect(getEventStatus(event)).toBe('in-progress');
        });

        it('identifies done events', () => {
            const event = createMockEvent('2026-02-24T10:00:00Z', '2026-02-24T11:00:00Z');
            expect(getEventStatus(event)).toBe('done');
        });
    });

    describe('getTimeUntilLabel', () => {
        it('formats < 60 mins correctly', () => {
            const event = createMockEvent('2026-02-24T12:30:00Z');
            expect(getTimeUntilLabel(event)).toBe('in 30 min');
        });

        it('formats <= 20 hrs correctly', () => {
            const event = createMockEvent('2026-02-24T16:00:00Z'); // 4 hours away
            expect(getTimeUntilLabel(event)).toBe('in 4 hr');
        });

        it('formats > 20 hrs correctly (days)', () => {
            const event = createMockEvent('2026-02-26T12:00:00Z'); // 2 days away
            expect(getTimeUntilLabel(event)).toBe('in 2 days');
        });

        it('returns null for past events', () => {
            const event = createMockEvent('2026-02-24T11:00:00Z');
            expect(getTimeUntilLabel(event)).toBe(null);
        });
    });
});
