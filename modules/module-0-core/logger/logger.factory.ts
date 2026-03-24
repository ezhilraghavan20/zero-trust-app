import { ILogger } from './logger.interface';

/**
 * Factory for creating logger instances.
 */
export const LoggerFactory = {
    create: (): ILogger => {
        // TODO: Return production-grade logger instance (e.g., Winston/Pino)
        return {} as ILogger;
    }
};
