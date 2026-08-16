import { AuthInput } from '../contracts';
import { ValidationUtil } from '../../module-0-core/utils';

/**
 * Validator for authentication credentials.
 */
export class CredentialsValidator {
    async validate(input: AuthInput): Promise<{ valid: boolean; errors: string[] }> {
        const errors: string[] = [];

        const hasIdentifier = ValidationUtil.isNonEmptyString(input.username) || ValidationUtil.isEmail(input.email);
        if (!hasIdentifier) {
            errors.push('A username or valid email is required');
        }

        if (!ValidationUtil.isNonEmptyString(input.password)) {
            errors.push('Password is required');
        } else if (input.password!.length < 8) {
            errors.push('Password must be at least 8 characters');
        }

        if (input.mfaToken !== undefined && !/^\d{6}$/.test(input.mfaToken)) {
            errors.push('MFA token must be a 6-digit code');
        }

        return { valid: errors.length === 0, errors };
    }
}
