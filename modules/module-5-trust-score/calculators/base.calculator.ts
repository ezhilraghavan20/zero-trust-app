export abstract class BaseCalculator {
    /**
     * TODO: Define strategy contract for calculating trust scores.
     * Inheriting classes will implement specific rules or weighted models.
     */
    public abstract calculate(aggregatedSignals: any): number;
}
