import { ResourceAccessRequest } from '../contracts';

/**
 * Only requests carrying valid enforcement provenance (stamped by Module 7's
 * ResourceAdapter) are accepted — the resource layer must never be directly
 * reachable.
 */
export class ResourceAdapter {
    public acceptTraffic(rawPayload: any): ResourceAccessRequest {
        const enforcementContext = rawPayload?.enforcementContext;

        if (
            !enforcementContext ||
            enforcementContext.enforcedBy !== 'module-7-enforcement-point' ||
            !enforcementContext.requestId
        ) {
            throw new Error('Rejected: traffic did not originate from the Policy Enforcement Point');
        }

        if (!rawPayload.resourceId || !rawPayload.action) {
            throw new Error('Rejected: malformed resource access request');
        }

        return {
            resourceId: rawPayload.resourceId,
            action: rawPayload.action,
            payload: rawPayload.payload,
            enforcementContext
        };
    }
}
