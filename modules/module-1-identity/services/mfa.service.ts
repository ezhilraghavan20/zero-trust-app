import { TimeUtil } from '../../module-0-core/utils';
import { securityConfig } from '../../module-0-core/config';
import * as crypto from 'crypto';

interface Challenge {
    code: string;
    expiresAt: string;
    attempts: number;
}

/**
 * Service for handling Multifactor Authentication (MFA) challenges and verification.
 *
 * Generates time-boxed numeric codes. In this reference implementation the
 * "delivery" channel (TOTP/Email/SMS) is abstracted behind `deliver()`, which
 * logs the code — swap in a real notification provider without changing the
 * verification logic.
 */
export class MFAService {
    private readonly challenges = new Map<string, Challenge>();
    private readonly maxAttempts = 3;

    async generateChallenge(userId: string): Promise<string> {
        const code = crypto.randomInt(0, 1000000).toString().padStart(6, '0');
        this.challenges.set(userId, {
            code,
            expiresAt: TimeUtil.ttlExpiry(securityConfig.mfaCodeTtlSeconds),
            attempts: 0
        });
        this.deliver(userId, code);
        return code;
    }

    async verifyChallenge(userId: string, code: string): Promise<boolean> {
        const challenge = this.challenges.get(userId);
        if (!challenge) return false;

        if (TimeUtil.isExpired(challenge.expiresAt)) {
            this.challenges.delete(userId);
            return false;
        }

        challenge.attempts += 1;
        if (challenge.attempts > this.maxAttempts) {
            this.challenges.delete(userId);
            return false;
        }

        const isValid = challenge.code === code;
        if (isValid) {
            this.challenges.delete(userId);
        }
        return isValid;
    }

    private deliver(userId: string, code: string): void {
        // Reference implementation: log the code instead of sending it over
        // TOTP/Email/SMS. Replace with a real provider integration.
        // eslint-disable-next-line no-console
        console.log(`[MFAService] Challenge code for ${userId}: ${code}`);
    }
}
