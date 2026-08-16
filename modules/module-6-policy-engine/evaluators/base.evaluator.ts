import { PolicyEngineInput } from '../contracts';
import { PolicyModel } from '../policies/policy.model';

/**
 * Base contract for a policy evaluator: given a request and a single
 * candidate policy, determine whether that policy's criteria are satisfied.
 */
export abstract class BaseEvaluator {
    public abstract evaluate(input: PolicyEngineInput, policy: PolicyModel): boolean;

    /**
     * Whether the policy's resource/action patterns apply to this request,
     * independent of trust score. Supports a single trailing '*' wildcard
     * (e.g. 'admin/*') or an exact match, plus a bare '*' matching anything.
     */
    protected matchesPattern(value: string, pattern: string): boolean {
        if (pattern === '*') return true;
        if (pattern.endsWith('/*')) {
            const prefix = pattern.slice(0, -1); // keep trailing '/'
            return value.startsWith(prefix);
        }
        return value === pattern;
    }

    public matches(input: PolicyEngineInput, policy: PolicyModel): boolean {
        return (
            this.matchesPattern(input.resourceId, policy.resourcePattern) &&
            this.matchesPattern(input.action, policy.actionPattern)
        );
    }
}
