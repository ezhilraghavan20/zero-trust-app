import { AggregatedSignals } from '../aggregators/signal.aggregator';
import { securityConfig } from '../../module-0-core';

export class ScoreExplainer {
    /**
     * Generate human-readable explainability metadata based on the
     * aggregated signals and the calculated score — e.g. "Device risk is
     * HIGH, dropping overall trust score".
     */
    public explain(aggregatedSignals: AggregatedSignals, finalScore: number): Record<string, any> {
        const { categoryDetails, resourceSensitivityPenalty } = aggregatedSignals;
        const reasons: string[] = [];

        const categoryLabel: Record<string, string> = {
            identity: 'Identity trust',
            device: 'Device trust',
            network: 'Network/location trust',
            behavior: 'Behavior trust'
        };

        for (const [key, summary] of Object.entries(categoryDetails)) {
            if (summary.signalCount === 0) {
                continue;
            }
            if (summary.averageRiskScore >= 60) {
                reasons.push(
                    `${categoryLabel[key]} is significantly reduced by elevated risk` +
                        (summary.highestRiskReason ? ` (${summary.highestRiskReason})` : '')
                );
            } else if (summary.averageRiskScore >= 30) {
                reasons.push(`${categoryLabel[key]} is moderately reduced by risk signals`);
            }
        }

        if (resourceSensitivityPenalty > 0) {
            reasons.push(`Trust score reduced by ${resourceSensitivityPenalty.toFixed(1)} points due to resource sensitivity`);
        }

        if (reasons.length === 0) {
            reasons.push('No significant risk signals detected across identity, device, network, or behavior');
        }

        let confidence: 'HIGH' | 'MEDIUM' | 'LOW';
        if (finalScore >= securityConfig.trustScoreThresholds.allow) {
            confidence = 'HIGH';
        } else if (finalScore >= securityConfig.trustScoreThresholds.stepUp) {
            confidence = 'MEDIUM';
        } else {
            confidence = 'LOW';
        }

        return {
            reason: reasons.join('; '),
            reasons,
            confidence,
            scoreBreakdown: {
                identityTrust: aggregatedSignals.identityTrust,
                deviceTrust: aggregatedSignals.deviceTrust,
                networkTrust: aggregatedSignals.networkTrust,
                behaviorTrust: aggregatedSignals.behaviorTrust,
                resourceSensitivityPenalty
            }
        };
    }
}
