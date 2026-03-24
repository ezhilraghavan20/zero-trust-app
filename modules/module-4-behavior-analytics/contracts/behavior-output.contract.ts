// import { RiskSignal } from '../../module-0-core';

export interface BehaviorAnalyticsOutput {
    // TODO: define output structure, e.g., a RiskSignal or an array of risk signals
    identityId: string;
    riskScore: number; // e.g., 0 to 100
    anomaliesDetected: string[];
}
