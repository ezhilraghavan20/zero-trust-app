export interface AccessRecord {
    action: string;
    resource: string;
    timestamp: Date;
}

export interface IdentityBaseline {
    identityId: string;
    history: AccessRecord[];
    resourceFrequency: Record<string, number>;
    hourFrequency: Record<number, number>;
    totalAccesses: number;
    firstSeenAt: Date;
    lastSeenAt: Date;
}

const MAX_HISTORY = 200;
const DEFAULT_BASELINE_SAMPLE_SIZE = 5; // accesses needed before baseline is "trusted"

function emptyBaseline(identityId: string): IdentityBaseline {
    const now = new Date();
    return {
        identityId,
        history: [],
        resourceFrequency: {},
        hourFrequency: {},
        totalAccesses: 0,
        firstSeenAt: now,
        lastSeenAt: now
    };
}

/**
 * Maintains a per-identity behavioral baseline in memory. Reads never
 * mutate state; `recordAccess` is the only write path, invoked once per
 * evaluated request by BehaviorAnalyticsService after detectors have run
 * against the baseline as it stood *before* this request.
 */
export class BaselineManager {
    private readonly baselines = new Map<string, IdentityBaseline>();

    /**
     * Retrieve behavioral baseline for an identity. Returns a fresh, empty
     * baseline (not persisted) if none exists yet — callers should treat an
     * empty baseline as "insufficient data" rather than "anomalous".
     */
    public getBaseline(identityId: string): IdentityBaseline {
        return this.baselines.get(identityId) ?? emptyBaseline(identityId);
    }

    public hasSufficientData(identityId: string): boolean {
        const baseline = this.baselines.get(identityId);
        return !!baseline && baseline.totalAccesses >= DEFAULT_BASELINE_SAMPLE_SIZE;
    }

    public recordAccess(identityId: string, record: AccessRecord): void {
        const baseline = this.baselines.get(identityId) ?? emptyBaseline(identityId);

        baseline.history.push(record);
        if (baseline.history.length > MAX_HISTORY) {
            baseline.history.shift();
        }

        baseline.resourceFrequency[record.resource] = (baseline.resourceFrequency[record.resource] || 0) + 1;

        const hour = record.timestamp.getUTCHours();
        baseline.hourFrequency[hour] = (baseline.hourFrequency[hour] || 0) + 1;

        baseline.totalAccesses += 1;
        baseline.lastSeenAt = record.timestamp;

        this.baselines.set(identityId, baseline);
    }
}
