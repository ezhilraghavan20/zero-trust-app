import { AccessRequestPayload, AccessDecisionResponse, IntegrationCredentials, ClientType } from '../contracts';
import { defaultGateway } from '../gateway';

/**
 * Adapts requests coming from browser-based web applications, which
 * typically carry an API key issued at app registration.
 */
export class WebAppAdapter {
  constructor(private credentials: IntegrationCredentials) {}

  public adaptRequest(payload: AccessRequestPayload): Promise<AccessDecisionResponse> {
    return defaultGateway.handleRequest({
      clientType: ClientType.WEB_APP,
      credentials: this.credentials,
      payload
    });
  }
}
