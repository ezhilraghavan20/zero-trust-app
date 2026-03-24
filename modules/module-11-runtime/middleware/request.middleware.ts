/**
 * Middleware for standard request processing and tracing.
 */
export const requestMiddleware = (req: any, res: any, next: any) => {
    // Generate request ID and attach to context
    req.id = req.headers['x-request-id'] || Math.random().toString(36).substring(7);
    next();
};
