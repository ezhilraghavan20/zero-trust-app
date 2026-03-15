export type DecisionAction = 'ALLOW' | 'DENY' | 'STEP-UP';

export interface PolicyEngineOutput {
    requestId: string;
    decision: DecisionAction;
    evaluationReason: string;
    matchedPolicies: string[];
}
