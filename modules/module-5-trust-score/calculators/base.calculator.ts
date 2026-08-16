import { AggregatedSignals } from '../aggregators/signal.aggregator';

/**
 * Strategy contract for calculating trust scores. Inheriting classes
 * implement specific rules or weighted models over the same aggregated
 * signal shape, so scoring strategies can be swapped without touching
 * ScoreEngineService.
 */
export abstract class BaseCalculator {
    public abstract calculate(aggregatedSignals: AggregatedSignals): number;
}
