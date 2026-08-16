import { AccessDecisionResponse } from '../contracts';
import { CryptoUtil } from '../../module-0-core';

/**
 * Parses the raw IPipelineOutcome-shaped response from Module 11's
 * RequestPipeline into the typed, client-facing AccessDecisionResponse.
 */
export class AccessResponseParser {
  public parse(rawResponse: any): AccessDecisionResponse {
    const decision = rawResponse?.decision;
    const stepUpRequired = decision === 'STEP-UP';

    return {
      allowed: !!rawResponse?.allowed,
      reason: rawResponse?.reason,
      stepUpRequired,
      stepUpType: stepUpRequired ? 'MFA' : undefined,
      transactionId: rawResponse?.requestId || `txn-${CryptoUtil.randomToken(8)}`
    };
  }
}
