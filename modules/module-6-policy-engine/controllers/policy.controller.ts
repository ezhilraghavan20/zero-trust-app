import { PolicyEngineService } from '../services';
import { PolicyEngineInput, PolicyEngineOutput } from '../contracts';
import { PolicyModel, DEFAULT_POLICIES } from '../policies';
import { ValidationUtil } from '../../module-0-core';

export class PolicyEngineController {
    private policyService: PolicyEngineService;

    constructor() {
        this.policyService = new PolicyEngineService();
    }

    /**
     * Handle incoming requests to evaluate application policy.
     */
    public handlePolicyEvaluation(input: PolicyEngineInput, policies: PolicyModel[] = DEFAULT_POLICIES): PolicyEngineOutput {
        ValidationUtil.assert(ValidationUtil.isNonEmptyString(input.requestId), 'requestId is required');
        ValidationUtil.assert(ValidationUtil.isNonEmptyString(input.resourceId), 'resourceId is required');
        ValidationUtil.assert(ValidationUtil.isNonEmptyString(input.action), 'action is required');
        ValidationUtil.assert(ValidationUtil.isInRange(input.trustScore, 0, 100), 'trustScore must be between 0 and 100');

        return this.policyService.evaluatePolicies(input, policies);
    }
}
