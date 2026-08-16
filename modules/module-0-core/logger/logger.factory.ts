import { ILogger } from './logger.interface';

/**
 * Minimal structured console logger. Swappable for Winston/Pino in production
 * without changing any call sites since callers only depend on ILogger.
 */
class ConsoleLogger implements ILogger {
    constructor(private readonly scope?: string) {}

    private write(level: string, message: string, context?: any, error?: Error): void {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            scope: this.scope,
            message,
            ...(context ? { context } : {}),
            ...(error ? { error: { name: error.name, message: error.message, stack: error.stack } } : {})
        };
        // eslint-disable-next-line no-console
        const line = JSON.stringify(entry);
        if (level === 'error') console.error(line);
        else if (level === 'warn') console.warn(line);
        else console.log(line);
    }

    debug(message: string, context?: any): void {
        if (process.env.NODE_ENV === 'production') return;
        this.write('debug', message, context);
    }
    info(message: string, context?: any): void {
        this.write('info', message, context);
    }
    warn(message: string, context?: any): void {
        this.write('warn', message, context);
    }
    error(message: string, context?: any, error?: Error): void {
        this.write('error', message, context, error);
    }
}

/**
 * Factory for creating logger instances.
 */
export const LoggerFactory = {
    create: (scope?: string): ILogger => {
        return new ConsoleLogger(scope);
    }
};
