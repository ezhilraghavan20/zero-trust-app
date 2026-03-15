import { EnforcementService } from '../services';
import { EnforcementInput, EnforcementOutput } from '../contracts';

export class EnforcementController {
    private enforcementService: EnforcementService;

    constructor() {
        this.enforcementService = new EnforcementService();
    }

    /**
     * TODO: Receive decision payload from Policy Engine and trigger enforcement.
     * This would typically be wired into a gateway middleware.
     */
    public handleEnforcement(input: EnforcementInput): void {
        const outcome = this.enforcementService.enforce(input);

        // TODO: use adapters to shape the actual HTTP response or upstream request
        // based on 'outcome'.
    }
}
