import * as crypto from 'crypto';

/**
 * Cryptographic helper functions for hashing and signing.
 * Uses Node's built-in `crypto` module only (no external dependencies):
 * - scrypt for password hashing (memory-hard, no bcrypt/argon2 dependency needed)
 * - HMAC-SHA256 for lightweight signed tokens
 */
export const CryptoUtil = {
    sha256(input: string): string {
        return crypto.createHash('sha256').update(input).digest('hex');
    },

    randomToken(bytes: number = 32): string {
        return crypto.randomBytes(bytes).toString('hex');
    },

    /**
     * Hash a password using scrypt with a random salt.
     * Returns "salt:hash" so verification is self-contained.
     */
    hashPassword(password: string): string {
        const salt = crypto.randomBytes(16).toString('hex');
        const derived = crypto.scryptSync(password, salt, 64).toString('hex');
        return `${salt}:${derived}`;
    },

    verifyPassword(password: string, storedHash: string): boolean {
        const [salt, hash] = storedHash.split(':');
        if (!salt || !hash) return false;
        const derived = crypto.scryptSync(password, salt, 64);
        const stored = Buffer.from(hash, 'hex');
        if (derived.length !== stored.length) return false;
        return crypto.timingSafeEqual(derived, stored);
    },

    hmacSign(payload: string, secret: string): string {
        return crypto.createHmac('sha256', secret).update(payload).digest('hex');
    },

    hmacVerify(payload: string, signature: string, secret: string): boolean {
        const expected = CryptoUtil.hmacSign(payload, secret);
        const a = Buffer.from(expected, 'hex');
        const b = Buffer.from(signature, 'hex');
        if (a.length !== b.length) return false;
        return crypto.timingSafeEqual(a, b);
    }
};
