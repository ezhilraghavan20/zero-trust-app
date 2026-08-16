import { AccessRequestPayload, AccessDecisionResponse, IntegrationCredentials } from '../../contracts';
import { MicroserviceAdapter } from '../../adapters';

/**
 * SDK surface for Backend Microservices, authenticating via mTLS client
 * certificates (see IntegrationCredentials.clientCert).
 */
export class ZTServiceClient {
  private readonly adapter: MicroserviceAdapter;

  constructor(private credentials: IntegrationCredentials) {
    this.adapter = new MicroserviceAdapter(credentials);
  }

  public async requestAccess(payload: AccessRequestPayload): Promise<AccessDecisionResponse> {
    return this.adapter.adaptRequest(payload);
  }
}
