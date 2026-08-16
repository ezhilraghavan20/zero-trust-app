/**
 * Docker/Container configuration settings.
 */
export const dockerConfig = {
    enabled: process.env.DOCKER_MODE === 'true',
    healthCheckInterval: 60000, // 1 minute
};
