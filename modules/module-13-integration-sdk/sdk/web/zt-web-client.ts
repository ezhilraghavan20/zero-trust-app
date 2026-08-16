import { AccessRequestPayload, AccessDecisionResponse, IntegrationCredentials } from '../../contracts';
import { WebAppAdapter } from '../../adapters';

/**
 * SDK surface for Web Apps. Wraps the WebAppAdapter so consumers of the SDK
 * never need to know about the gateway/adapter plumbing underneath.
 */
export class ZTWebClient {
  private readonly adapter: WebAppAdapter;

  constructor(private credentials: IntegrationCredentials) {
    this.adapter = new WebAppAdapter(credentials);
  }

  public async requestAccess(payload: AccessRequestPayload): Promise<AccessDecisionResponse> {
    return this.adapter.adaptRequest(payload);
  }
}
