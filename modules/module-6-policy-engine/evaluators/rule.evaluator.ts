import { BaseEvaluator } from './base.evaluator';
import { PolicyEngineInput } from '../contracts';
import { PolicyModel } from '../policies/policy.model';

export class RuleEvaluator extends BaseEvaluator {
    /**
     * Deterministic rule evaluation: the policy applies to this request
     * (resource/action pattern match) AND the request's trust score meets
     * the policy's minimum trust requirement.
     */
    public evaluate(input: PolicyEngineInput, policy: PolicyModel): boolean {
        if (!this.matches(input, policy)) {
            return false;
        }
        return input.trustScore >= policy.minTrustScore;
    }
}
