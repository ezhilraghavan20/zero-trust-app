import { AccessRequestPayload } from '../contracts';
import { CryptoUtil } from '../../module-0-core';

/**
 * Normalizes a client's AccessRequestPayload into the request shape that
 * Module 11's RequestPipeline expects (an Express-request-like object).
 */
export class AccessRequestBuilder {
  public buildPipelineRequest(payload: AccessRequestPayload): any {
    return {
      id: `req-${CryptoUtil.randomToken(8)}`,
      path: `/api/v1/${payload.resourceId}`,
      method: payload.action,
      headers: {
        'user-agent': 'integration-sdk',
        ...(payload.context?.headers || {})
      },
      clientIp: payload.context?.ipAddress || '0.0.0.0',
      body: {
        context: payload.context?.contextInput,
        device: payload.deviceContext
      }
    };
  }
}
