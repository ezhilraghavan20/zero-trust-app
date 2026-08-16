import { EnforcementInput, EnforcementOutput } from '../contracts';

export class DenyHandler {
    /**
     * Handle DENY decisions: block the request from ever reaching the
     * resource layer and return an appropriate error payload.
     */
    public handle(input: EnforcementInput): EnforcementOutput {
        return {
            requestId: input.requestId,
            enforcedAction: 'DENY',
            timestamp: new Date(),
            responseContext: {
                statusCode: 403,
                forwardToResource: false,
                message: 'Access Denied',
                reason: input.evaluationReason
            }
        };
    }
}
