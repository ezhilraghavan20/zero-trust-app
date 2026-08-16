import { securityConfig } from '../../module-0-core/config';

/**
 * Minimal CORS enforcement driven by SecurityConfig.corsOrigins. Without this,
 * SecurityConfig.corsOrigins was defined but never actually applied anywhere
 * — any origin could make credentialed cross-origin requests against the API.
 */
export const corsMiddleware = (req: any, res: any, next: any) => {
    const origin = req.headers.origin;
    const allowedOrigins = securityConfig.corsOrigins;
    const allowAll = allowedOrigins.length === 1 && allowedOrigins[0] === '*';

    if (allowAll) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    } else if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-Id');

    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }
    next();
};
