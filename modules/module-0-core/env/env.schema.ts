/**
 * Schema-based validation for environment variables.
 */
export interface EnvSchema {
    NODE_ENV: 'development' | 'test' | 'production';
    PORT: number;
    JWT_SECRET: string;
    ACCESS_TOKEN_TTL: number;
    REFRESH_TOKEN_TTL: number;
    MFA_CODE_TTL: number;
    CORS_ORIGINS: string;
    MAX_LOGIN_ATTEMPTS: number;
    DB_DRIVER: 'memory' | 'postgres';
    DATABASE_URL: string;
}

export const REQUIRED_ENV_KEYS: (keyof EnvSchema)[] = [];

export const ENV_DEFAULTS: Partial<Record<keyof EnvSchema, string>> = {
    NODE_ENV: 'development',
    PORT: '3000',
    JWT_SECRET: 'dev-only-insecure-secret-change-me',
    ACCESS_TOKEN_TTL: '900',
    REFRESH_TOKEN_TTL: '86400',
    MFA_CODE_TTL: '300',
    CORS_ORIGINS: '*',
    MAX_LOGIN_ATTEMPTS: '5',
    DB_DRIVER: 'memory',
    DATABASE_URL: 'memory://local'
};
