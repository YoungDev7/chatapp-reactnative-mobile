/// <reference types="jest" />
/// <reference types="node" />
import { formatMessageTimestamp, isWithinOneMinute, shouldShowTimestamp } from '../timestampUtils';

describe('timestampUtils', () => {
  const currentTimezone = process.env.TZ;

  describe('formatMessageTimestamp', () => {
    describe('edge cases', () => {
      test('returns empty string for null', () => {
        expect(formatMessageTimestamp(null)).toBe('');
      });

      test('returns empty string for undefined', () => {
        expect(formatMessageTimestamp(undefined)).toBe('');
      });

      test('returns empty string for invalid date string', () => {
        expect(formatMessageTimestamp('invalid-date')).toBe('');
      });

      test('returns empty string for NaN timestamp', () => {
        expect(formatMessageTimestamp(NaN)).toBe('');
      });
    });

    describe('timezone conversion test (hours)', () => {
      // 2025-12-29T16:35:18.918Z = 1767026118.918 = 29th December 2025 16:35 UTC
      const mockNow = new Date('2025-12-29T16:35:18.918Z');

      beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(mockNow);
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      test(`converts ${currentTimezone} timezone timestamp correctly`, () => {
        const utcUnixTimestampNow = 1767026118.918;
        const result = formatMessageTimestamp(utcUnixTimestampNow);

        console.log('result: ' + result);
        console.log('timezone: ' + currentTimezone);
        console.log('mock now: ' + mockNow);

        if (currentTimezone === 'America/Los_Angeles') {
          expect(result).toBe('08:35');
        }

        if (currentTimezone === 'Asia/Tokyo') {
          expect(result).toBe('01:35');
        }

        if (currentTimezone === 'America/New_York') {
          expect(result).toBe('11:35');
        }

        if (currentTimezone === 'Europe/Berlin') {
          expect(result).toBe('17:35');
        }

        if (currentTimezone === 'UTC') {
          expect(result).toBe('16:35');
        }
      });

      test('formats ISO 8601 string correctly', () => {
        const isoString = '2025-12-29T16:35:18.918Z';
        const result = formatMessageTimestamp(isoString);
        // Should show time only (same day)
        expect(result).toMatch(/^\d{2}:\d{2}$/);
      });

      test('formats Date object correctly', () => {
        const dateObj = new Date('2025-12-29T16:35:18.918Z');
        const result = formatMessageTimestamp(dateObj);
        expect(result).toMatch(/^\d{2}:\d{2}$/);
      });
    });

    describe('date formatting rules', () => {
      test('shows only time for today', () => {
        const now = new Date();
        jest.useFakeTimers();
        jest.setSystemTime(now);

        const result = formatMessageTimestamp(now);
        // Should be in HH:MM format
        expect(result).toMatch(/^\d{2}:\d{2}$/);

        jest.useRealTimers();
      });

      test('shows month and day for different day same year', () => {
        const now = new Date('2025-06-15T12:00:00Z');
        jest.useFakeTimers();
        jest.setSystemTime(now);

        // Yesterday
        const yesterday = new Date('2025-06-14T14:30:00Z');
        const result = formatMessageTimestamp(yesterday);
        
        // Should include month and day but not year
        expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}, \d{2}:\d{2}$/);
        expect(result).not.toContain('2025');

        jest.useRealTimers();
      });

      test('shows full date with year for different year', () => {
        const now = new Date('2026-01-15T12:00:00Z');
        jest.useFakeTimers();
        jest.setSystemTime(now);

        // Last year
        const lastYear = new Date('2025-12-25T10:00:00Z');
        const result = formatMessageTimestamp(lastYear);
        
        // Should include year
        expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}, \d{4} \d{2}:\d{2}$/);
        expect(result).toContain('2025');

        jest.useRealTimers();
      });
    });
  });

  describe('isWithinOneMinute', () => {
    test('returns false for null timestamps', () => {
      expect(isWithinOneMinute(null, null)).toBe(false);
      expect(isWithinOneMinute(null, new Date())).toBe(false);
      expect(isWithinOneMinute(new Date(), null)).toBe(false);
    });

    test('returns false for undefined timestamps', () => {
      expect(isWithinOneMinute(undefined, undefined)).toBe(false);
      expect(isWithinOneMinute(undefined, new Date())).toBe(false);
      expect(isWithinOneMinute(new Date(), undefined)).toBe(false);
    });

    test('returns true for same timestamp', () => {
      const timestamp = new Date('2025-12-29T16:35:00Z');
      expect(isWithinOneMinute(timestamp, timestamp)).toBe(true);
    });

    test('returns true for timestamps 30 seconds apart', () => {
      const t1 = new Date('2025-12-29T16:35:00Z');
      const t2 = new Date('2025-12-29T16:35:30Z');
      expect(isWithinOneMinute(t1, t2)).toBe(true);
    });

    test('returns true for timestamps 59 seconds apart', () => {
      const t1 = new Date('2025-12-29T16:35:00Z');
      const t2 = new Date('2025-12-29T16:35:59Z');
      expect(isWithinOneMinute(t1, t2)).toBe(true);
    });

    test('returns false for timestamps 61 seconds apart', () => {
      const t1 = new Date('2025-12-29T16:35:00Z');
      const t2 = new Date('2025-12-29T16:36:01Z');
      expect(isWithinOneMinute(t1, t2)).toBe(false);
    });

    test('returns false for timestamps 5 minutes apart', () => {
      const t1 = new Date('2025-12-29T16:35:00Z');
      const t2 = new Date('2025-12-29T16:40:00Z');
      expect(isWithinOneMinute(t1, t2)).toBe(false);
    });

    test('handles Unix timestamps (seconds)', () => {
      const t1 = 1767026100; // Some Unix timestamp
      const t2 = 1767026130; // 30 seconds later
      expect(isWithinOneMinute(t1, t2)).toBe(true);
    });

    test('handles ISO 8601 strings', () => {
      const t1 = '2025-12-29T16:35:00Z';
      const t2 = '2025-12-29T16:35:30Z';
      expect(isWithinOneMinute(t1, t2)).toBe(true);
    });

    test('handles mixed types', () => {
      const t1 = new Date('2025-12-29T16:35:00Z');
      const t2 = '2025-12-29T16:35:30Z';
      expect(isWithinOneMinute(t1, t2)).toBe(true);
    });
  });

  describe('shouldShowTimestamp', () => {
    const currentTimestamp = new Date('2025-12-29T16:35:00Z');

    test('returns true for first message (no previous)', () => {
      expect(shouldShowTimestamp(currentTimestamp, null, 'user1', null)).toBe(true);
    });

    test('returns true when sender changes', () => {
      const previousTimestamp = new Date('2025-12-29T16:34:30Z');
      expect(shouldShowTimestamp(currentTimestamp, previousTimestamp, 'user2', 'user1')).toBe(true);
    });

    test('returns false for same sender within one minute', () => {
      const previousTimestamp = new Date('2025-12-29T16:34:30Z');
      expect(shouldShowTimestamp(currentTimestamp, previousTimestamp, 'user1', 'user1')).toBe(false);
    });

    test('returns true for same sender after more than one minute', () => {
      const previousTimestamp = new Date('2025-12-29T16:33:00Z');
      expect(shouldShowTimestamp(currentTimestamp, previousTimestamp, 'user1', 'user1')).toBe(true);
    });

    test('returns true when previous sender is null', () => {
      const previousTimestamp = new Date('2025-12-29T16:34:30Z');
      expect(shouldShowTimestamp(currentTimestamp, previousTimestamp, 'user1', null)).toBe(true);
    });

    test('returns true when previous timestamp is null', () => {
      expect(shouldShowTimestamp(currentTimestamp, null, 'user1', 'user1')).toBe(true);
    });
  });
});
