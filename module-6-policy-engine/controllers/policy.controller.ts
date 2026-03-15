import { PolicyEngineService } from '../services';
import { PolicyEngineInput, PolicyEngineOutput } from '../contracts';
import { PolicyModel } from '../policies/policy.model';

export class PolicyEngineController {
    private policyService: PolicyEngineService;

    constructor() {
        this.policyService = new PolicyEngineService();
    }

    /**
     * TODO: Handle incoming requests to evaluate application policy.
     */
    public handlePolicyEvaluation(input: PolicyEngineInput, policies: PolicyModel[]): PolicyEngineOutput {
        // TODO: validation
        return this.policyService.evaluatePolicies(input, policies);
    }
}
