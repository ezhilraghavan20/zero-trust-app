import { BaseCalculator } from './base.calculator';
import { AggregatedSignals } from '../aggregators/signal.aggregator';
import { trustScoreNormalizationDivisor } from '../../module-0-core';

/**
 * Implements the platform's weighted scoring formula:
 *
 *   Trust Score = ( IT + DT + NT + BT − RS ) / 85 × 100
 *
 * Weights themselves live in module-0-core's trustScoreConfig (versioned
 * configuration), not hardcoded here — this class only implements the
 * formula shape.
 */
export class WeightedCalculator extends BaseCalculator {
    public calculate(aggregatedSignals: AggregatedSignals): number {
        const { identityTrust, deviceTrust, networkTrust, behaviorTrust, resourceSensitivityPenalty } =
            aggregatedSignals;

        const raw =
            (identityTrust + deviceTrust + networkTrust + behaviorTrust - resourceSensitivityPenalty) /
            trustScoreNormalizationDivisor *
            100;

        const clamped = Math.min(100, Math.max(0, raw));
        return Math.round(clamped * 100) / 100;
    }
}
