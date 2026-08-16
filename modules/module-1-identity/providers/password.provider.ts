import { CryptoUtil } from '../../module-0-core/utils';

/**
 * Provider for password-related operations (hashing, verification).
 * Uses scrypt (Node built-in, memory-hard) via CryptoUtil — no external
 * hashing dependency (argon2/bcrypt) required.
 */
export class PasswordProvider {
    async hash(password: string): Promise<string> {
        return CryptoUtil.hashPassword(password);
    }

    async verify(password: string, hash: string): Promise<boolean> {
        return CryptoUtil.verifyPassword(password, hash);
    }
}
