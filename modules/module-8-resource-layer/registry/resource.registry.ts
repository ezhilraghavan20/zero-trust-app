import { ResourceAccessRequest, ResourceAccessResponse } from '../contracts';
import { DashboardApplication } from '../apps/app.interface';
import { ReportsApi } from '../apis/api.interface';
import { CustomerRecordsStore } from '../data/data.interface';
import { ResourceAdapter } from '../adapters/resource.adapter';

/**
 * Routes an accepted resource-access request to the correct backing
 * resource (application, API, or data store) based on resourceId prefix.
 * Resources are completely trust-agnostic: by the time a request reaches
 * this registry it has already been validated as coming from the
 * Enforcement Point via ResourceAdapter.
 */
export class ResourceRegistry {
    private readonly adapter = new ResourceAdapter();
    private readonly app = new DashboardApplication();
    private readonly api = new ReportsApi();
    private readonly dataStore = new CustomerRecordsStore();

    public route(rawPayload: any): ResourceAccessResponse {
        const request: ResourceAccessRequest = this.adapter.acceptTraffic(rawPayload);

        if (request.resourceId.startsWith('app/')) {
            return this.app.handleAppRequest(request);
        }
        if (request.resourceId.startsWith('api/')) {
            return this.api.handleApiContent(request);
        }
        if (request.resourceId.startsWith('data/')) {
            return this.dataStore.handleDataQuery(request);
        }

        return { resourceId: request.resourceId, status: 'FAILURE', data: { error: 'Unknown resource type' } };
    }
}
