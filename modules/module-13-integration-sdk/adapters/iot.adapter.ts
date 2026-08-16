import { AccessRequestPayload, AccessDecisionResponse, IntegrationCredentials, ClientType } from '../contracts';
import { defaultGateway } from '../gateway';

/**
 * Adapts requests coming from IoT/edge devices. These devices typically
 * report minimal or no device telemetry, which DeviceContextBuilder handles
 * by falling back to conservative (non-compliant-leaning) defaults.
 */
export class IotAdapter {
  constructor(private credentials: IntegrationCredentials) {}

  public adaptRequest(payload: AccessRequestPayload): Promise<AccessDecisionResponse> {
    return defaultGateway.handleRequest({
      clientType: ClientType.IOT_DEVICE,
      credentials: this.credentials,
      payload
    });
  }
}
