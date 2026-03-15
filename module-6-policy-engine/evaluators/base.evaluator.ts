import { PolicyEngineInput } from '../contracts';
import { PolicyModel } from '../policies/policy.model';

export abstract class BaseEvaluator {
    /**
     * TODO: Define the base contract for a policy evaluator.
     */
    public abstract evaluate(input: PolicyEngineInput, policy: PolicyModel): boolean;
}
