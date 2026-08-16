import { AuthInput, AuthOutput } from '../contracts';
import { PasswordProvider, TokenProvider } from '../providers';
import { MFAService } from './mfa.service';
import { CredentialsValidator } from '../validators';
import { userStore } from '../store/user.store';
import { AuthError } from '../../module-0-core/errors';
import { TimeUtil, CryptoUtil } from '../../module-0-core/utils';
import { securityConfig } from '../../module-0-core/config';
import { IIdentityContract } from '../../module-0-core/contracts';

/**
 * Service for orchestrating the authentication lifecycle:
 * Verification -> MFA challenge (if required) -> Signal Emission -> Token Issuance.
 */
export class AuthService {
    private readonly validator = new CredentialsValidator();
    private readonly activeSessions = new Map<string, { userId: string; issuedAt: string }>();

    private static readonly revokedTokenIds = new Set<string>();

    constructor(
        private readonly passwordProvider: PasswordProvider,
        private readonly tokenProvider: TokenProvider,
        private readonly mfaService: MFAService = new MFAService()
    ) {}

    async login(input: AuthInput): Promise<AuthOutput> {
        const { valid, errors } = await this.validator.validate(input);
        if (!valid) {
            throw new AuthError(errors.join('; '), 'INVALID_CREDENTIALS_FORMAT');
        }

        const identifier = input.username || input.email!;
        const user = userStore.findByIdentifier(identifier);
        if (!user) {
            throw new AuthError('Invalid username or password', 'AUTH_FAILURE');
        }

        if (user.lockedUntil && !TimeUtil.isExpired(user.lockedUntil)) {
            // Deliberately identical to the invalid-credentials message below —
            // a distinct "account locked" message would let an attacker
            // enumerate valid usernames by brute-forcing until they observe
            // the message change.
            throw new AuthError('Invalid username or password', 'AUTH_FAILURE');
        }

        const passwordValid = await this.passwordProvider.verify(input.password!, user.passwordHash);
        if (!passwordValid) {
            user.failedLoginAttempts += 1;
            if (user.failedLoginAttempts >= securityConfig.maxLoginAttempts) {
                user.lockedUntil = TimeUtil.ttlExpiry(300);
            }
            userStore.save(user);
            throw new AuthError('Invalid username or password', 'AUTH_FAILURE');
        }

        user.failedLoginAttempts = 0;
        user.lockedUntil = undefined;

        if (user.mfaEnabled && !input.mfaToken) {
            await this.mfaService.generateChallenge(user.userId);
            userStore.save(user);
            return {
                success: false,
                mfaRequired: true,
                mfaType: 'TOTP'
            };
        }

        if (user.mfaEnabled && input.mfaToken) {
            const mfaValid = await this.mfaService.verifyChallenge(user.userId, input.mfaToken);
            if (!mfaValid) {
                throw new AuthError('Invalid or expired MFA code', 'MFA_FAILURE');
            }
        }

        user.lastLoginAt = TimeUtil.nowIso();
        userStore.save(user);

        const identityContext: IIdentityContract = {
            userId: user.userId,
            authenticated: true,
            claims: {
                role: user.role,
                mfaVerified: user.mfaEnabled,
                username: user.username
            },
            issuedAt: TimeUtil.nowIso()
        };

        const accessToken = await this.tokenProvider.sign({ userId: user.userId, role: user.role, type: 'access', jti: CryptoUtil.randomToken(8) });
        const refreshToken = await this.tokenProvider.sign(
            { userId: user.userId, role: user.role, type: 'refresh', jti: CryptoUtil.randomToken(8) },
            securityConfig.refreshTokenTtlSeconds
        );

        this.activeSessions.set(refreshToken, { userId: user.userId, issuedAt: TimeUtil.nowIso() });

        return {
            success: true,
            accessToken,
            refreshToken,
            identityContext,
            mfaRequired: false
        };
    }

    async logout(sessionId: string): Promise<void> {
        this.activeSessions.delete(sessionId);
        // Revoke the token's jti so it can no longer be used, closing the gap
        // where a previously issued access/refresh token remained valid after
        // logout until its natural expiry.
        const decoded = await this.tokenProvider.decode(sessionId);
        if (decoded?.jti) {
            AuthService.revokedTokenIds.add(decoded.jti);
        }
    }

    async verifyAccessToken(token: string): Promise<IIdentityContract> {
        const payload = await this.tokenProvider.verify(token);

        // Reject tokens revoked via logout.
        if (payload.jti && AuthService.revokedTokenIds.has(payload.jti)) {
            throw new AuthError('Token has been revoked', 'TOKEN_REVOKED');
        }

        // A refresh token must never be usable as an access token — without
        // this check a stolen long-lived (24h) refresh token could be used
        // directly against protected resources instead of only to mint a
        // new short-lived access token.
        if (payload.type && payload.type !== 'access') {
            throw new AuthError('Refresh tokens cannot be used for API access', 'INVALID_TOKEN_TYPE');
        }

        const user = userStore.findById(payload.userId);
        if (!user) {
            throw new AuthError('Identity no longer exists', 'AUTH_FAILURE');
        }
        return {
            userId: user.userId,
            authenticated: true,
            claims: { role: user.role, username: user.username },
            issuedAt: payload.iat
        };
    }
}
