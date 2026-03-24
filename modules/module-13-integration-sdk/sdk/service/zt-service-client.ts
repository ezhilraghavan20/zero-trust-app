import { AccessRequestPayload, AccessDecisionResponse, IntegrationCredentials } from '../../contracts';

export class ZTServiceClient {
  constructor(private credentials: IntegrationCredentials) {}

  // TODO: SDK surface for Backend Microservices
  public async requestAccess(payload: AccessRequestPayload): Promise<AccessDecisionResponse> {
    throw new Error('Not implemented');
  }
}
