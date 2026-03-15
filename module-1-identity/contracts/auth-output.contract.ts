import { IIdentityContract } from '../../module-0-core/contracts';

/**
 * Output contract for the authentication process.
 */
export interface AuthOutput {
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    identityContext?: IIdentityContract;
    mfaRequired: boolean;
    mfaType?: 'TOTP' | 'EMAIL' | 'SMS';
}
