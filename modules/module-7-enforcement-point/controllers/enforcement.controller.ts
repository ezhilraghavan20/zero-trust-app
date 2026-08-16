import { EnforcementService } from '../services';
import { EnforcementInput } from '../contracts';
import { ResponseAdapter, ClientResponse } from '../adapters/response.adapter';
import { ResourceAdapter, UpstreamResourceRequest } from '../adapters/resource.adapter';

export class EnforcementController {
    private enforcementService: EnforcementService;
    private responseAdapter = new ResponseAdapter();
    private resourceAdapter = new ResourceAdapter();

    constructor() {
        this.enforcementService = new EnforcementService();
    }

    /**
     * Receive decision payload from the Policy Engine, trigger enforcement,
     * and shape the result for both the client response and (when allowed)
     * the upstream resource-layer request. Intended to be wired into a
     * gateway middleware, which handles the actual HTTP send/forward.
     */
    public handleEnforcement(input: EnforcementInput): {
        clientResponse: ClientResponse;
        upstreamRequest: UpstreamResourceRequest | null;
    } {
        const outcome = this.enforcementService.enforce(input);

        const clientResponse = this.responseAdapter.prepareClientResponse(outcome);
        const upstreamRequest =
            outcome.enforcedAction === 'ALLOW' ? this.resourceAdapter.prepareUpstreamRequest(outcome) : null;

        return { clientResponse, upstreamRequest };
    }
}
