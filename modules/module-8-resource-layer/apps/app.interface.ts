import { ResourceAccessRequest, ResourceAccessResponse } from '../contracts';

export interface ProtectedApplication {
    /**
     * Handle application specific requests coming from the Enforcement Point.
     */
    handleAppRequest(request: ResourceAccessRequest): ResourceAccessResponse;
}

/**
 * Reference application resource — represents an internal dashboard/app.
 * A real deployment would proxy to the actual application; this returns a
 * deterministic mock payload so the full pipeline is demonstrable end-to-end.
 */
export class DashboardApplication implements ProtectedApplication {
    handleAppRequest(request: ResourceAccessRequest): ResourceAccessResponse {
        return {
            resourceId: request.resourceId,
            status: 'SUCCESS',
            data: {
                view: 'dashboard',
                action: request.action,
                renderedAt: new Date().toISOString()
            }
        };
    }
}
