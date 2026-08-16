import { IContextInput } from '../contracts';
import { RiskLevel } from '../../module-0-core';

// Heuristic keyword match for anonymizing infrastructure. A production system
// would query a maintained Tor exit-node / proxy / hosting-ASN reputation feed.
const ANONYMIZER_KEYWORDS = ['tor', 'proxy', 'vpn', 'anonymous', 'hosting', 'datacenter'];

/**
 * Analyzes network-level risk signals.
 */
export class NetworkSignal {
    public process(network: IContextInput['network']) {
        const isp = (network.isp || '').toLowerCase();
        const isTorOrProxy = ANONYMIZER_KEYWORDS.some((keyword) => isp.includes(keyword));

        let riskLevel: RiskLevel;
        if (isTorOrProxy) {
            riskLevel = RiskLevel.HIGH;
        } else if (network.isPublicWifi) {
            riskLevel = RiskLevel.MEDIUM;
        } else {
            riskLevel = RiskLevel.NEGLIGIBLE;
        }

        return {
            isPublicWifi: network.isPublicWifi,
            isTorOrProxy,
            connectionType: network.connectionType,
            riskLevel
        };
    }
}
