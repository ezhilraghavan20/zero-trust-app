import { IContextContract, RiskLevel } from '../../module-0-core';

/**
 * Normalized context risk output for the trust engine.
 */
export interface IContextRisk extends IContextContract {
    anomaliesDetected: string[];
    riskDetails: {
        locationRisk: RiskLevel;
        networkRisk: RiskLevel;
        timeRisk: RiskLevel;
    };
    evaluatedAt: Date;
}
