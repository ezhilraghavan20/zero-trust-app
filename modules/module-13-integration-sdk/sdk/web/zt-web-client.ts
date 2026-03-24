import { AccessRequestPayload, AccessDecisionResponse, IntegrationCredentials } from '../../contracts';

export class ZTWebClient {
  constructor(private credentials: IntegrationCredentials) {}

  // TODO: SDK surface for Web Apps
  public async requestAccess(payload: AccessRequestPayload): Promise<AccessDecisionResponse> {
    throw new Error('Not implemented');
  }
}
