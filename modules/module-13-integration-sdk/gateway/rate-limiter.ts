import { IntegrationCredentials } from '../contracts';

interface Bucket {
  count: number;
  windowStart: number;
}

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 120;

/**
 * Fixed-window rate limiter keyed by client ID, applied before requests
 * enter the full zero-trust evaluation pipeline to protect it from abuse.
 */
export class GatewayRateLimiter {
  private static readonly buckets = new Map<string, Bucket>();

  public async checkLimit(credentials: IntegrationCredentials): Promise<boolean> {
    const now = Date.now();
    const existing = GatewayRateLimiter.buckets.get(credentials.clientId);

    if (!existing || now - existing.windowStart >= WINDOW_MS) {
      GatewayRateLimiter.buckets.set(credentials.clientId, { count: 1, windowStart: now });
      return true;
    }

    if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
      return false;
    }

    existing.count += 1;
    return true;
  }
}
