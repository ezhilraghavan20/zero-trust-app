import { AccessRequestPayload, AccessDecisionResponse, IntegrationCredentials } from '../../contracts';

export class ZTMobileClient {
  constructor(private credentials: IntegrationCredentials) {}

  // TODO: SDK surface for Mobile Apps
  public async requestAccess(payload: AccessRequestPayload): Promise<AccessDecisionResponse> {
    throw new Error('Not implemented');
  }
}
