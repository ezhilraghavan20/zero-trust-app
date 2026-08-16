import { ScoreEngineInput } from '../contracts';
import { IRiskSignal, trustScoreConfig } from '../../module-0-core';

export interface AggregatedSignals {
    identityTrust: number; // points earned out of identityTrustMax
    deviceTrust: number; // points earned out of deviceTrustMax
    networkTrust: number; // points earned out of networkTrustMax
    behaviorTrust: number; // points earned out of behaviorTrustMax
    resourceSensitivityPenalty: number; // points deducted, out of resourceSensitivityMax
    categoryDetails: {
        identity: CategorySummary;
        device: CategorySummary;
        network: CategorySummary;
        behavior: CategorySummary;
    };
}

interface CategorySummary {
    signalCount: number;
    averageRiskScore: number;
    highestRiskReason?: string;
}

/**
 * A signal with no data is treated as neutral (full trust for that
 * category) rather than penalized, since the absence of a risk signal is
 * not itself evidence of risk.
 */
function summarizeCategory(signals: IRiskSignal[]): CategorySummary {
    if (!signals.length) {
        return { signalCount: 0, averageRiskScore: 0 };
    }
    const averageRiskScore = signals.reduce((sum, s) => sum + s.score, 0) / signals.length;
    const worst = [...signals].sort((a, b) => b.score - a.score)[0];
    return {
        signalCount: signals.length,
        averageRiskScore,
        highestRiskReason: worst?.reason
    };
}

function trustPoints(averageRiskScore: number, maxPoints: number): number {
    const riskFraction = Math.min(100, Math.max(0, averageRiskScore)) / 100;
    const trustFraction = 1 - riskFraction;
    return Math.round(trustFraction * maxPoints * 100) / 100;
}

export class SignalAggregator {
    /**
     * Aggregate and normalize risk signals from Identity, Device, Context,
     * and Behavior modules into weighted trust-point contributions, plus a
     * resource-sensitivity penalty extracted from any signal explicitly
     * flagged as resource-sensitivity related.
     */
    public aggregate(input: ScoreEngineInput): AggregatedSignals {
        const identity = summarizeCategory(input.identitySignals);
        const device = summarizeCategory(input.deviceSignals);
        const network = summarizeCategory(input.contextSignals);
        const behavior = summarizeCategory(input.behaviorSignals);

        const allSignals = [
            ...input.identitySignals,
            ...input.deviceSignals,
            ...input.contextSignals,
            ...input.behaviorSignals
        ];
        const sensitivitySignal = allSignals.find((s) => (s.reason || '').toUpperCase().includes('SENSITIV'));
        const resourceSensitivityPenalty = sensitivitySignal
            ? Math.round((sensitivitySignal.score / 100) * trustScoreConfig.resourceSensitivityMax * 100) / 100
            : 0;

        return {
            identityTrust: trustPoints(identity.averageRiskScore, trustScoreConfig.identityTrustMax),
            deviceTrust: trustPoints(device.averageRiskScore, trustScoreConfig.deviceTrustMax),
            networkTrust: trustPoints(network.averageRiskScore, trustScoreConfig.networkTrustMax),
            behaviorTrust: trustPoints(behavior.averageRiskScore, trustScoreConfig.behaviorTrustMax),
            resourceSensitivityPenalty,
            categoryDetails: { identity, device, network, behavior }
        };
    }
}
