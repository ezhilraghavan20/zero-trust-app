import { EnforcementInput, EnforcementOutput } from '../contracts';

export class AllowHandler {
    /**
     * TODO: Handle ALLOW decisions.
     * Forward the request to the upstream resource layer.
     */
    public handle(input: EnforcementInput): EnforcementOutput {
        // TODO: implement ALLOW enforcement
        return {
            requestId: input.requestId,
            enforcedAction: 'ALLOW',
            timestamp: new Date(),
            responseContext: {}
        };
    }
}
