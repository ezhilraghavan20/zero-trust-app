/**
 * Fixed-window, per-IP rate limiter for the main Express app. Module 13's
 * GatewayRateLimiter only protects SDK/integration traffic — this covers the
 * directly exposed HTTP surface (in particular /api/auth/login, which
 * otherwise has no defence against distributed/credential-stuffing attempts;
 * per-account lockout alone does not stop an attacker spreading guesses
 * across many accounts from one IP).
 */
interface Bucket {
    count: number;
    windowStart: number;
}

const buckets = new Map<string, Bucket>();

export function createRateLimiter(windowMs: number, maxRequests: number) {
    return (req: any, res: any, next: any) => {
        const key = `${req.ip || req.connection?.remoteAddress || 'unknown'}:${req.path}`;
        const now = Date.now();
        const existing = buckets.get(key);

        if (!existing || now - existing.windowStart >= windowMs) {
            buckets.set(key, { count: 1, windowStart: now });
            next();
            return;
        }

        if (existing.count >= maxRequests) {
            res.status(429).json({ error: 'Too many requests, please try again later' });
            return;
        }

        existing.count += 1;
        next();
    };
}

// Stricter limit on authentication endpoints to blunt credential stuffing
// and brute-force attempts; looser general-purpose limit elsewhere.
export const authRateLimiter = createRateLimiter(60_000, 10);
export const apiRateLimiter = createRateLimiter(60_000, 300);
