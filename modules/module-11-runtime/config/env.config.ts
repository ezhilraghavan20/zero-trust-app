/**
 * Runtime environment configuration.
 */
export const envConfig = {
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isLocal: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
};
