import { BehaviorAnalyticsInput } from '../contracts';
import { IdentityBaseline } from '../baselines/baseline.manager';

const RECENT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const SCANNING_DISTINCT_RESOURCE_THRESHOLD = 8;
const MIN_HISTORY_FOR_NOVELTY_CHECK = 5;

export class SequenceDetector {
    /**
     * Flags anomalies in the *sequence* of resources accessed: previously
     * unseen resources for an established identity, and rapid access to
     * many distinct resources in a short window (scanning behavior).
     */
    public detect(input: BehaviorAnalyticsInput, baselineData: IdentityBaseline): string[] {
        const anomalies: string[] = [];

        const isKnownResource = !!baselineData.resourceFrequency[input.resource];
        if (baselineData.totalAccesses >= MIN_HISTORY_FOR_NOVELTY_CHECK && !isKnownResource) {
            anomalies.push('UNUSUAL_RESOURCE_ACCESSED');
        }

        const recentResources = new Set(
            baselineData.history
                .filter((record) => input.timestamp.getTime() - record.timestamp.getTime() <= RECENT_WINDOW_MS)
                .map((record) => record.resource)
        );
        recentResources.add(input.resource);

        if (recentResources.size >= SCANNING_DISTINCT_RESOURCE_THRESHOLD) {
            anomalies.push('RESOURCE_SCANNING_PATTERN');
        }

        return anomalies;
    }
}
