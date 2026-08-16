export * from './integration.gateway';
export * from './rate-limiter';

import { IntegrationGateway } from './integration.gateway';
import { GatewayRateLimiter } from './rate-limiter';

/** Shared singleton gateway used by all adapters and SDK clients. */
export const defaultGateway = new IntegrationGateway(new GatewayRateLimiter());
