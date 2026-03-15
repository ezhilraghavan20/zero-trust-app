// import { DecisionAction } from '../../module-6-policy-engine/contracts';

export interface EnforcementInput {
    requestId: string;
    resourceId: string;
    action: string;
    // TODO: type from module 6 instead of redefining
    decision: 'ALLOW' | 'DENY' | 'STEP-UP';
    evaluationReason: string;
}
