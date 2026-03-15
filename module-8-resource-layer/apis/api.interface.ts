import { ResourceAccessRequest, ResourceAccessResponse } from '../contracts';

export interface ProtectedApi {
    /**
     * TODO: Handle API specific requests coming from the Enforcement Point.
     */
    handleApiContent(request: ResourceAccessRequest): ResourceAccessResponse;
}
