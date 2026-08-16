import { EnforcementOutput } from '../contracts';

export interface UpstreamResourceRequest {
    resourceId: string;
    action: string;
    enforcementContext: Record<string, any>;
}

export class ResourceAdapter {
    /**
     * Transform a generic ALLOW enforcement outcome into the resource-layer
     * request shape (Module 8's ResourceAccessRequest), stamping enforcement
     * provenance so the resource layer can verify traffic came through the
     * enforcement point rather than being reached directly.
     */
    public prepareUpstreamRequest(enforcementOutcome: EnforcementOutput): UpstreamResourceRequest {
        return {
            resourceId: enforcementOutcome.responseContext.resourceId,
            action: enforcementOutcome.responseContext.action,
            enforcementContext: {
                requestId: enforcementOutcome.requestId,
                enforcedAt: enforcementOutcome.timestamp.toISOString(),
                enforcedBy: 'module-7-enforcement-point'
            }
        };
    }
}
