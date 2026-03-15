import { EnforcementInput, EnforcementOutput } from '../contracts';

export class DenyHandler {
    /**
     * TODO: Handle DENY decisions.
     * Block the request and return an appropriate error code/payload.
     */
    public handle(input: EnforcementInput): EnforcementOutput {
        // TODO: implement DENY enforcement
        return {
            requestId: input.requestId,
            enforcedAction: 'DENY',
            timestamp: new Date(),
            responseContext: {
                statusCode: 403,
                message: 'Access Denied'
            }
        };
    }
}
