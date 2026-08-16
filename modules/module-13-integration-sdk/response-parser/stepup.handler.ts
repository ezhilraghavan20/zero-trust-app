import { AccessDecisionResponse } from '../contracts';
import { LoggerFactory } from '../../module-0-core';

const logger = LoggerFactory.create('StepUpHandler');

/**
 * Formats step-up (additional verification) requirements for the client SDK
 * to act on — e.g. prompting the user for an MFA code and retrying the
 * request with it attached.
 */
export class StepUpHandler {
  public handleStepUp(response: AccessDecisionResponse): void {
    if (!response.stepUpRequired) return;

    logger.info('Step-up authentication required', {
      transactionId: response.transactionId,
      stepUpType: response.stepUpType || 'MFA'
    });
  }
}
