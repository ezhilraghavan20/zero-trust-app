import { BehaviorAnalyticsInput, BehaviorAnalyticsOutput } from '../contracts';
import { BaselineManager } from '../baselines';
import { FrequencyDetector, SequenceDetector, DeviationDetector } from '../detectors';

// Point value contributed to the risk score per anomaly type. More severe
// anomalies (account-takeover-adjacent patterns) weigh more heavily.
const ANOMALY_WEIGHTS: Record<string, number> = {
    REQUEST_BURST_DETECTED: 25,
    FREQUENCY_SPIKE_VS_BASELINE: 20,
    UNUSUAL_RESOURCE_ACCESSED: 15,
    RESOURCE_SCANNING_PATTERN: 35,
    UNUSUAL_ACCESS_TIME: 15
};

export class BehaviorAnalyticsService {
    private baselineManager: BaselineManager;
    private frequencyDetector: FrequencyDetector;
    private sequenceDetector: SequenceDetector;
    private deviationDetector: DeviationDetector;

    constructor() {
        this.baselineManager = new BaselineManager();
        this.frequencyDetector = new FrequencyDetector();
        this.sequenceDetector = new SequenceDetector();
        this.deviationDetector = new DeviationDetector();
    }

    /**
     * Orchestrates behavior analysis: retrieve the identity's baseline as it
     * stood before this request, run all detectors against it, aggregate
     * results into a risk score, then record this access into the baseline.
     */
    public analyzeBehavior(input: BehaviorAnalyticsInput): BehaviorAnalyticsOutput {
        const baseline = this.baselineManager.getBaseline(input.identityId);
        const hasSufficientData = this.baselineManager.hasSufficientData(input.identityId);

        const anomalies = new Set<string>([
            ...this.frequencyDetector.detect(input, baseline),
            ...this.sequenceDetector.detect(input, baseline),
            ...this.deviationDetector.detect(input, baseline)
        ]);

        const rawScore = Array.from(anomalies).reduce(
            (sum, anomaly) => sum + (ANOMALY_WEIGHTS[anomaly] || 10),
            0
        );
        const riskScore = Math.min(100, rawScore);

        // Record this access for future evaluations. Recorded after
        // detection so this request is judged against prior behavior only.
        this.baselineManager.recordAccess(input.identityId, {
            action: input.action,
            resource: input.resource,
            timestamp: input.timestamp
        });

        return {
            identityId: input.identityId,
            riskScore,
            anomaliesDetected: Array.from(anomalies),
            baselineConfidence: !hasSufficientData
                ? 'INSUFFICIENT_DATA'
                : baseline.totalAccesses < 20
                ? 'LOW'
                : 'ESTABLISHED'
        };
    }
}
