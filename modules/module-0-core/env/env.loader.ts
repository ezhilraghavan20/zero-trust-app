import { EnvSchema, ENV_DEFAULTS, REQUIRED_ENV_KEYS } from './env.schema';

/**
 * Responsible for loading environment variables from .env or process context.
 */
function readEnv(): EnvSchema {
    const missing: string[] = [];

    const get = (key: keyof EnvSchema): string => {
        const value = process.env[key as string] ?? ENV_DEFAULTS[key];
        if (value === undefined) {
            missing.push(key as string);
            return '';
        }
        return value;
    };

    const resolved: EnvSchema = {
        NODE_ENV: get('NODE_ENV') as EnvSchema['NODE_ENV'],
        PORT: Number(get('PORT')),
        JWT_SECRET: get('JWT_SECRET'),
        ACCESS_TOKEN_TTL: Number(get('ACCESS_TOKEN_TTL')),
        REFRESH_TOKEN_TTL: Number(get('REFRESH_TOKEN_TTL')),
        MFA_CODE_TTL: Number(get('MFA_CODE_TTL')),
        CORS_ORIGINS: get('CORS_ORIGINS'),
        MAX_LOGIN_ATTEMPTS: Number(get('MAX_LOGIN_ATTEMPTS')),
        DB_DRIVER: get('DB_DRIVER') as EnvSchema['DB_DRIVER'],
        DATABASE_URL: get('DATABASE_URL')
    };

    for (const key of REQUIRED_ENV_KEYS) {
        if (missing.includes(key as string)) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    }

    return resolved;
}

let cachedEnv: EnvSchema | null = null;

export const envLoader = {
    load(): EnvSchema {
        if (!cachedEnv) {
            cachedEnv = readEnv();
        }
        return cachedEnv;
    },
    reload(): EnvSchema {
        cachedEnv = readEnv();
        return cachedEnv;
    },
    get<K extends keyof EnvSchema>(key: K): EnvSchema[K] {
        return this.load()[key];
    }
};
