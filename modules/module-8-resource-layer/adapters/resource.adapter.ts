import { ResourceAccessRequest } from '../contracts';

export class ResourceAdapter {
    /**
     * TODO: Validate that the incoming request is strictly from the Enforcement Point (Module 7).
     * Transform enforcement payload into internal resource constructs.
     */
    public acceptTraffic(rawPayload: any): ResourceAccessRequest {
        // TODO: implement logic ensuring traffic comes from PEP only
        return {
            resourceId: 'unknown',
            action: 'unknown',
            enforcementContext: {}
        };
    }
}
