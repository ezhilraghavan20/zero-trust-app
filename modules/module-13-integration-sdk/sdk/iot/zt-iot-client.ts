import { AccessRequestPayload, AccessDecisionResponse, IntegrationCredentials } from '../../contracts';
import { IotAdapter } from '../../adapters';

/**
 * SDK surface for IoT and edge devices. Context is intentionally omitted
 * from the payload type — constrained devices typically can't collect rich
 * contextual signals, so only resourceId/action/deviceContext are exposed.
 */
export class ZTIotClient {
  private readonly adapter: IotAdapter;

  constructor(private credentials: IntegrationCredentials) {
    this.adapter = new IotAdapter(credentials);
  }

  public async requestAccess(payload: Omit<AccessRequestPayload, 'context'>): Promise<AccessDecisionResponse> {
    return this.adapter.adaptRequest(payload);
  }
}
