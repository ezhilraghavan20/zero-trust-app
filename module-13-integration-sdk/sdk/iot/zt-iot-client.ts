import { AccessRequestPayload, AccessDecisionResponse, IntegrationCredentials } from '../../contracts';

export class ZTIotClient {
  constructor(private credentials: IntegrationCredentials) {}

  // TODO: SDK surface for IoT and edge devices
  public async requestAccess(payload: Omit<AccessRequestPayload, 'context'>): Promise<AccessDecisionResponse> {
    throw new Error('Not implemented');
  }
}
