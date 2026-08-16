import { AccessRequestPayload, AccessDecisionResponse, IntegrationCredentials, ClientType } from '../contracts';
import { defaultGateway } from '../gateway';

/**
 * Adapts requests coming from native mobile applications.
 */
export class MobileAdapter {
  constructor(private credentials: IntegrationCredentials) {}

  public adaptRequest(payload: AccessRequestPayload): Promise<AccessDecisionResponse> {
    return defaultGateway.handleRequest({
      clientType: ClientType.MOBILE_APP,
      credentials: this.credentials,
      payload
    });
  }
}
