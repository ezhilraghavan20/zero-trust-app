/**
 * Shared time-related utility functions.
 */
export const TimeUtil = {
    now(): Date {
        return new Date();
    },

    nowIso(): string {
        return new Date().toISOString();
    },

    addSeconds(date: Date, seconds: number): Date {
        return new Date(date.getTime() + seconds * 1000);
    },

    isExpired(expiresAt: string | Date): boolean {
        const expiry = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
        return expiry.getTime() < Date.now();
    },

    secondsBetween(a: Date, b: Date): number {
        return Math.abs((b.getTime() - a.getTime()) / 1000);
    },

    ttlExpiry(seconds: number): string {
        return TimeUtil.addSeconds(new Date(), seconds).toISOString();
    },

    isWithinBusinessHours(date: Date = new Date(), startHour = 7, endHour = 20): boolean {
        const hour = date.getUTCHours();
        return hour >= startHour && hour < endHour;
    }
};
