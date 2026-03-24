import { IDeviceContract, RiskLevel } from '../../module-0-core';

/**
 * Enriched device posture output for the trust engine.
 */
export interface IDevicePosture extends IDeviceContract {
    deviceType: string;
    riskLevel: RiskLevel;
    signals: {
        osHealthy: boolean;
        securityHealthy: boolean;
        networkTrusted: boolean;
    };
    lastEvaluatedAt: Date;
}
