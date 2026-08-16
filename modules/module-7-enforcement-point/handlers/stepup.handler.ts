import { EnforcementInput, EnforcementOutput } from '../contracts';

export class StepUpHandler {
    /**
     * Handle STEP-UP decisions: block the current request but signal the
     * client to complete a secondary authentication (MFA) flow before
     * retrying, rather than an outright denial.
     */
    public handle(input: EnforcementInput): EnforcementOutput {
        return {
            requestId: input.requestId,
            enforcedAction: 'STEP-UP',
            timestamp: new Date(),
            responseContext: {
                statusCode: 401,
                forwardToResource: false,
                message: 'Additional verification required',
                reason: input.evaluationReason,
                challengeUrl: '/auth/mfa'
            }
        };
    }
}
