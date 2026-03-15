import { PolicyEngineOutput, DecisionAction } from '../contracts';

export class DecisionBuilder {
    /**
     * TODO: Build a structured decision reasoning object.
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
