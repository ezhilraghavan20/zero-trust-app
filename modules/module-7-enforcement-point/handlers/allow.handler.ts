import { EnforcementInput, EnforcementOutput } from '../contracts';

export class AllowHandler {
    /**
     * Handle ALLOW decisions: signal that the request should be forwarded
     * to the upstream resource layer (Module 8). The actual forwarding is
     * performed by ResourceAdapter using this handler's output.
     */
    public handle(input: EnforcementInput): EnforcementOutput {
        return {
            requestId: input.requestId,
            enforcedAction: 'ALLOW',
            timestamp: new Date(),
            responseContext: {
                statusCode: 200,
                forwardToResource: true,
                resourceId: input.resourceId,
                action: input.action,
                message: 'Access granted'
            }
        };
    }
}
