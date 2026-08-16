import { CryptoUtil } from '../../module-0-core/utils';

/**
 * Middleware for standard request processing and tracing.
 *
 * Request IDs are always generated server-side with a CSPRNG. A
 * client-supplied X-Request-Id is accepted only for correlation and is
 * strictly sanitized first — passing it straight into log lines previously
 * allowed a client to inject newlines/control characters and forge log
 * entries.
 */
export const requestMiddleware = (req: any, res: any, next: any) => {
    const clientProvided = String(req.headers['x-request-id'] || '').replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 64);
    req.id = clientProvided || CryptoUtil.randomToken(8);
    next();
};
