import { ResourceAccessRequest, ResourceAccessResponse } from '../contracts';

export interface ProtectedDataStore {
    /**
     * TODO: Handle data/database specific requests coming from the Enforcement Point.
     */
    handleDataQuery(request: ResourceAccessRequest): ResourceAccessResponse;
}
