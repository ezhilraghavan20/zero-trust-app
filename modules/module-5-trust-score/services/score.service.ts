import { ScoreEngineInput, ScoreEngineOutput } from '../contracts';
import { SignalAggregator } from '../aggregators';
import { WeightedCalculator } from '../calculators';
import { ScoreExplainer } from '../explainers';

export class ScoreEngineService {
    private aggregator: SignalAggregator;
    private calculator: WeightedCalculator;
    private explainer: ScoreExplainer;

    constructor() {
        this.aggregator = new SignalAggregator();
        this.calculator = new WeightedCalculator();
        this.explainer = new ScoreExplainer();
    }

    /**
     * Orchestrates score calculation: pulls risk signals from input,
     * aggregates them into weighted category trust points, runs the
     * formula-based calculation, and attaches explainability metadata.
     */
    public evaluateTrust(input: ScoreEngineInput): ScoreEngineOutput {
        // 1. Aggregate signals
        const aggregatedSignals = this.aggregator.aggregate(input);

        // 2. Calculate normalized score
        const trustScore = this.calculator.calculate(aggregatedSignals);

        // 3. Generate explainability metadata
        const explanationMeta = this.explainer.explain(aggregatedSignals, trustScore);

        return {
            requestId: input.requestId,
            identityId: input.identityId,
            trustScore,
            confidenceLabel: explanationMeta.confidence,
            explanation: explanationMeta
        };
    }
}
