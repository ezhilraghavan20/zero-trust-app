import { DecisionAction } from '../../module-6-policy-engine/contracts';

export interface EnforcementInput {
    requestId: string;
    resourceId: string;
    action: string;
    decision: DecisionAction;
    evaluationReason: string;
}
