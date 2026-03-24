/**
 * Universal logging interface for the application.
 */
export interface ILogger {
    debug(message: string, context?: any): void;
    info(message: string, context?: any): void;
    warn(message: string, context?: any): void;
    error(message: string, context?: any, error?: Error): void;
}
