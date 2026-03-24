import { AccessRequestPayload, AccessDecisionResponse } from '../contracts';

export class IotAdapter {
  // TODO: Translate IoT-specific payload to generic Integration request format
  public adaptRequest(payload: AccessRequestPayload): Promise<AccessDecisionResponse> {
    throw new Error('Not implemented');
  }
}
