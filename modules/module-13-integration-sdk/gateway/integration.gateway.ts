import { BaseIntegrationRequest, AccessDecisionResponse } from '../contracts';
import { GatewayRateLimiter } from './rate-limiter';

export class IntegrationGateway {
  constructor(private rateLimiter: GatewayRateLimiter) {}

  // TODO: Main entrypoint for integration SDKs. Forwards to module-11-runtime.
  public async handleRequest(request: BaseIntegrationRequest): Promise<AccessDecisionResponse> {
    throw new Error('Not implemented');
  }
}
