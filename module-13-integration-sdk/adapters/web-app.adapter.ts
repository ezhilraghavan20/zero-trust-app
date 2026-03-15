import { AccessRequestPayload, AccessDecisionResponse } from '../contracts';

export class WebAppAdapter {
  // TODO: Translate WebApp-specific payload to generic Integration request format
  public adaptRequest(payload: AccessRequestPayload): Promise<AccessDecisionResponse> {
    throw new Error('Not implemented');
  }
}
