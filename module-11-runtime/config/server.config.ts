/**
 * Server-specific configuration settings.
 */
export const serverConfig = {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    proxyTrust: process.env.PROXY_TRUST === 'true',
    timeout: 30000, // 30 seconds
};
