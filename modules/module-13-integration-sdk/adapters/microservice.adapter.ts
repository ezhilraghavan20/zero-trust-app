import { AccessRequestPayload, AccessDecisionResponse, IntegrationCredentials, ClientType } from '../contracts';
import { defaultGateway } from '../gateway';

/**
 * Adapts requests coming from backend microservices, which authenticate via
 * mTLS client certificates rather than an API key.
 */
export class MicroserviceAdapter {
  constructor(private credentials: IntegrationCredentials) {}

  public adaptRequest(payload: AccessRequestPayload): Promise<AccessDecisionResponse> {
    return defaultGateway.handleRequest({
      clientType: ClientType.MICROSERVICE,
      credentials: this.credentials,
      payload
    });
  }
}
