/**
 * Logger middleware integrating with Module 0 logger.
 */
export const loggingMiddleware = (req: any, res: any, next: any) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${req.id}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
    });

    next();
};
