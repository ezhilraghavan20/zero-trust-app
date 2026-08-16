import { AccessRequestPayload, AccessDecisionResponse, IntegrationCredentials } from '../../contracts';
import { MobileAdapter } from '../../adapters';

/**
 * SDK surface for Mobile Apps.
 */
export class ZTMobileClient {
  private readonly adapter: MobileAdapter;

  constructor(private credentials: IntegrationCredentials) {
    this.adapter = new MobileAdapter(credentials);
  }

  public async requestAccess(payload: AccessRequestPayload): Promise<AccessDecisionResponse> {
    return this.adapter.adaptRequest(payload);
  }
}
