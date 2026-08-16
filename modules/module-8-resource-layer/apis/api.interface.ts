import { ResourceAccessRequest, ResourceAccessResponse } from '../contracts';

export interface ProtectedApi {
    /**
     * Handle API specific requests coming from the Enforcement Point.
     */
    handleApiContent(request: ResourceAccessRequest): ResourceAccessResponse;
}

/**
 * Reference API resource — represents an internal reporting/API endpoint.
 */
export class ReportsApi implements ProtectedApi {
    handleApiContent(request: ResourceAccessRequest): ResourceAccessResponse {
        return {
            resourceId: request.resourceId,
            status: 'SUCCESS',
            data: {
                endpoint: request.resourceId,
                method: request.action,
                results: [],
                servedAt: new Date().toISOString()
            }
        };
    }
}
