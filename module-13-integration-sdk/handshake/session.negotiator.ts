import { IntegrationCredentials, HandshakeResponse } from '../contracts';

export class SessionNegotiator {
  // TODO: Establish an integration session and returning ID
  public negotiate(credentials: IntegrationCredentials): Promise<HandshakeResponse> {
    throw new Error('Not implemented');
  }
}
