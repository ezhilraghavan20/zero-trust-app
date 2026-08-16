import { BehaviorAnalyticsInput } from '../contracts';
import { IdentityBaseline } from '../baselines/baseline.manager';

const WINDOW_MS = 60 * 1000; // 1 minute
const BURST_THRESHOLD = 10; // requests within the window considered a burst

export class FrequencyDetector {
    /**
     * Flags request-frequency anomalies: bursts within a short window, and
     * rates that significantly exceed the identity's established baseline.
     */
    public detect(input: BehaviorAnalyticsInput, baselineData: IdentityBaseline): string[] {
        const anomalies: string[] = [];

        const recentCount = baselineData.history.filter(
            (record) => input.timestamp.getTime() - record.timestamp.getTime() <= WINDOW_MS
        ).length;

        if (recentCount >= BURST_THRESHOLD) {
            anomalies.push('REQUEST_BURST_DETECTED');
        }

        if (baselineData.totalAccesses > 0) {
            const spanSeconds = Math.max(
                1,
                (baselineData.lastSeenAt.getTime() - baselineData.firstSeenAt.getTime()) / 1000
            );
            const baselineRatePerMinute = (baselineData.totalAccesses / spanSeconds) * 60;
            const currentRatePerMinute = recentCount;

            if (baselineRatePerMinute > 0 && currentRatePerMinute > baselineRatePerMinute * 3) {
                anomalies.push('FREQUENCY_SPIKE_VS_BASELINE');
            }
        }

        return anomalies;
    }
}
