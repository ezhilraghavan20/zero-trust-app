import { IContextInput } from '../contracts';
import { IRiskSignal, RiskLevel } from '../../module-0-core';

/**
 * Analyzes network-level risk signals.
 */
export class NetworkSignal {
    public process(network: IContextInput['network']) {
        // TODO: Evaluate network safety and reputation
        return {
            isPublicWifi: network.isPublicWifi,
            isTorOrProxy: false, // Placeholder
            riskLevel: network.isPublicWifi ? RiskLevel.MEDIUM : RiskLevel.NEGLIGIBLE
        };
    }
}
