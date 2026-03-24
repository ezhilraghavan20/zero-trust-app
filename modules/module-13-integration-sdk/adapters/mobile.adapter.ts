import { AccessRequestPayload, AccessDecisionResponse } from '../contracts';

export class MobileAdapter {
  // TODO: Translate Mobile-specific payload to generic Integration request format
  public adaptRequest(payload: AccessRequestPayload): Promise<AccessDecisionResponse> {
    throw new Error('Not implemented');
  }
}
