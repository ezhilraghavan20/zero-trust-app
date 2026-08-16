import { EnforcementOutput } from '../contracts';

export interface ClientResponse {
    statusCode: number;
    body: Record<string, any>;
}

export class ResponseAdapter {
    /**
     * Transform an enforcement outcome into a client-facing HTTP response
     * payload (status code + JSON body).
     */
    public prepareClientResponse(enforcementOutcome: EnforcementOutput): ClientResponse {
        const { statusCode, message, reason, challengeUrl } = enforcementOutcome.responseContext;

        return {
            statusCode: statusCode || 500,
            body: {
                requestId: enforcementOutcome.requestId,
                decision: enforcementOutcome.enforcedAction,
                message: message || 'Request processed',
                ...(reason ? { reason } : {}),
                ...(challengeUrl ? { challengeUrl } : {})
            }
        };
    }
}
