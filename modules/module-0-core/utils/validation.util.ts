/**
 * Input validation utility using lightweight predicate logic
 * (no external schema library dependency required).
 */
export const ValidationUtil = {
    isNonEmptyString(value: unknown): value is string {
        return typeof value === 'string' && value.trim().length > 0;
    },

    isEmail(value: unknown): value is string {
        if (!ValidationUtil.isNonEmptyString(value)) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },

    isInRange(value: number, min: number, max: number): boolean {
        return typeof value === 'number' && !Number.isNaN(value) && value >= min && value <= max;
    },

    isIp(value: unknown): value is string {
        if (!ValidationUtil.isNonEmptyString(value)) return false;
        const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6 = /^[0-9a-fA-F:]+$/;
        return ipv4.test(value) || (value.includes(':') && ipv6.test(value));
    },

    assert(condition: boolean, message: string): void {
        if (!condition) {
            throw new Error(message);
        }
    },

    hasKeys<T extends object>(obj: T, keys: (keyof T)[]): boolean {
        return keys.every((key) => obj[key] !== undefined && obj[key] !== null);
    }
};
