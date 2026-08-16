/**
 * Application-wide configuration settings.
 */
export interface AppConfig {
    appName: string;
    env: 'development' | 'test' | 'production';
    port: number;
    isProduction: boolean;
}

export const appConfig: AppConfig = {
    appName: 'Zero Trust Access Control Platform',
    env: (process.env.NODE_ENV as AppConfig['env']) || 'development',
    port: Number(process.env.PORT) || 3000,
    isProduction: process.env.NODE_ENV === 'production'
};
