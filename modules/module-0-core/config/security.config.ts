import { appConfig } from './app.config';

/**
 * Security-specific configuration (CORS, Headers, TTLs).
 */
export interface SecurityConfig {
    jwtSecret: string;
    accessTokenTtlSeconds: number;
    refreshTokenTtlSeconds: number;
    mfaCodeTtlSeconds: number;
    corsOrigins: string[];
    trustScoreThresholds: {
        allow: number;
        stepUp: number;
    };
    maxLoginAttempts: number;
}

const DEV_ONLY_JWT_SECRET = 'dev-only-insecure-secret-change-me';
const configuredJwtSecret = process.env.JWT_SECRET || DEV_ONLY_JWT_SECRET;

// Fail closed in production rather than silently signing tokens with a
// secret that is checked into source control and known to every reader of
// this repository.
if (appConfig.isProduction && configuredJwtSecret === DEV_ONLY_JWT_SECRET) {
    throw new Error(
        'JWT_SECRET environment variable must be set to a strong random value in production. ' +
        'Refusing to start with the default development secret.'
    );
}

export const securityConfig: SecurityConfig = {
    jwtSecret: configuredJwtSecret,
    accessTokenTtlSeconds: Number(process.env.ACCESS_TOKEN_TTL) || 900, // 15 min
    refreshTokenTtlSeconds: Number(process.env.REFRESH_TOKEN_TTL) || 86400, // 24h
    mfaCodeTtlSeconds: Number(process.env.MFA_CODE_TTL) || 300, // 5 min
    corsOrigins: (process.env.CORS_ORIGINS || '*').split(','),
    trustScoreThresholds: {
        allow: 80,
        stepUp: 50
    },
    maxLoginAttempts: Number(process.env.MAX_LOGIN_ATTEMPTS) || 5
};
