import { PolicyEngineOutput, DecisionAction } from '../contracts';

export class DecisionBuilder {
    /**
     * Build a structured decision object combining the enforcement action,
     * the human-readable rationale, and the policy IDs that were evaluated.
     */
    public buildDecision(
        requestId: string,
        action: DecisionAction,
        reasoning: string,
        policies: string[]
    ): PolicyEngineOutput {
        return {
            requestId,
            decision: action,
            evaluationReason: reasoning,
            matchedPolicies: policies
        };
    }
}
