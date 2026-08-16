import { ResourceAccessRequest, ResourceAccessResponse } from '../contracts';

export interface ProtectedDataStore {
    /**
     * Handle data/database specific requests coming from the Enforcement Point.
     */
    handleDataQuery(request: ResourceAccessRequest): ResourceAccessResponse;
}

/**
 * Reference data-store resource — represents a sensitive records store.
 * Never accessible except through requests that have already passed the
 * full Zero Trust pipeline and were stamped by the Enforcement Point.
 */
export class CustomerRecordsStore implements ProtectedDataStore {
    private readonly records = new Map<string, any>([
        ['cust_001', { id: 'cust_001', name: 'Acme Corp', tier: 'ENTERPRISE' }],
        ['cust_002', { id: 'cust_002', name: 'Globex Inc', tier: 'STANDARD' }]
    ]);

    handleDataQuery(request: ResourceAccessRequest): ResourceAccessResponse {
        if (request.action === 'read' && request.payload?.id) {
            const record = this.records.get(request.payload.id);
            return record
                ? { resourceId: request.resourceId, status: 'SUCCESS', data: record }
                : { resourceId: request.resourceId, status: 'FAILURE', data: { error: 'Not found' } };
        }

        if (request.action === 'list') {
            return {
                resourceId: request.resourceId,
                status: 'SUCCESS',
                data: Array.from(this.records.values())
            };
        }

        return { resourceId: request.resourceId, status: 'FAILURE', data: { error: 'Unsupported action' } };
    }
}
