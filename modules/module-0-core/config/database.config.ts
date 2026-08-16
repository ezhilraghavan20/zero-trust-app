/**
 * Database connection and pool settings.
 * The reference implementation uses an in-memory store; these settings are
 * kept so a real database can be swapped in without touching call sites.
 */
export interface DatabaseConfig {
    driver: 'memory' | 'postgres';
    connectionString: string;
    poolMin: number;
    poolMax: number;
}

export const databaseConfig: DatabaseConfig = {
    driver: (process.env.DB_DRIVER as DatabaseConfig['driver']) || 'memory',
    connectionString: process.env.DATABASE_URL || 'memory://local',
    poolMin: Number(process.env.DB_POOL_MIN) || 1,
    poolMax: Number(process.env.DB_POOL_MAX) || 10
};
