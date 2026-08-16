/**
 * Adapter for handling requests coming through reverse proxies.
 */
export class ReverseProxyAdapter {
    public static handleHeaders(req: any): void {
        // Extract X-Forwarded-For, X-Real-IP, etc.
        const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        req.clientIp = clientIp;
    }
}
