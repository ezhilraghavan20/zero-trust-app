import { IntegrationCredentials } from '../contracts';

export class GatewayRateLimiter {
  // TODO: Limit inbound requests based on the client ID ahead of full pipeline evaluation
  public checkLimit(credentials: IntegrationCredentials): Promise<boolean> {
    throw new Error('Not implemented');
  }
}
