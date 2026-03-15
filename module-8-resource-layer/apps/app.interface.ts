import { ResourceAccessRequest, ResourceAccessResponse } from '../contracts';

export interface ProtectedApplication {
    /**
     * TODO: Handle application specific requests coming from the Enforcement Point.
     */
    handleAppRequest(request: ResourceAccessRequest): ResourceAccessResponse;
}
