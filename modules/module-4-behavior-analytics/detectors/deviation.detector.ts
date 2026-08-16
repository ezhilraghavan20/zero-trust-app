import { BehaviorAnalyticsInput } from '../contracts';
import { IdentityBaseline } from '../baselines/baseline.manager';

const MIN_HISTORY_FOR_TIME_CHECK = 5;

export class DeviationDetector {
    /**
     * Flags deviations from an identity's established access patterns, such
     * as accessing resources at hours far outside their historical norm.
     */
    public detect(input: BehaviorAnalyticsInput, baselineData: IdentityBaseline): string[] {
        const anomalies: string[] = [];

        if (baselineData.totalAccesses < MIN_HISTORY_FOR_TIME_CHECK) {
            return anomalies;
        }

        const hour = input.timestamp.getUTCHours();
        const hourCount = baselineData.hourFrequency[hour] || 0;
        const hourShare = hourCount / baselineData.totalAccesses;

        // If this identity has essentially never (< 5% of the time) accessed
        // the system during this hour of day, flag it as a time deviation.
        if (hourShare < 0.05) {
            anomalies.push('UNUSUAL_ACCESS_TIME');
        }

        return anomalies;
    }
}
