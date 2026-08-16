import { TelemetryEvent, SecurityInsight } from '../contracts/telemetry.contract';
import { feedbackPublisher } from '../feedback/feedback.publisher';
import { CryptoUtil, LoggerFactory } from '../../module-0-core';

const logger = LoggerFactory.create('AlertEngine');

interface DenyWindow {
    moduleId: string;
    timestamps: number[];
}

const DENY_BURST_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const DENY_BURST_THRESHOLD = 5;

/**
 * Generates informational alerts based on patterns observed in telemetry.
 * This is strictly observational: it never triggers or modifies
 * enforcement — it only publishes SecurityInsights for upstream modules
 * (via FeedbackPublisher) and logs them.
 */
export class AlertEngine {
    private readonly denyBursts = new Map<string, DenyWindow>();

    public process(event: TelemetryEvent): void {
        const insights: SecurityInsight[] = [];

        if (event.eventType === 'ALERT') {
            insights.push(this.buildInsight(event, 'MEDIUM', `Alert-level event received from ${event.moduleId}`));
        }

        if (this.isEnforcementDeny(event)) {
            const burstInsight = this.trackDenyBurst(event);
            if (burstInsight) insights.push(burstInsight);
        }

        if (this.isCriticalRisk(event)) {
            insights.push(this.buildInsight(event, 'CRITICAL', 'Critical risk signal detected in telemetry payload', 'INVESTIGATE_IMMEDIATELY'));
        }

        for (const insight of insights) {
            logger.warn(`Security insight generated: ${insight.description}`, { severity: insight.severity, source: insight.sourceModule });
            feedbackPublisher.publish(insight);
        }
    }

    private isEnforcementDeny(event: TelemetryEvent): boolean {
        return event.moduleId === 'EnforcementPoint' && event.payload?.enforcedAction === 'DENY';
    }

    private isCriticalRisk(event: TelemetryEvent): boolean {
        const level = event.payload?.riskLevel || event.payload?.level;
        return level === 'CRITICAL';
    }

    private trackDenyBurst(event: TelemetryEvent): SecurityInsight | null {
        const key = event.payload?.identityId || event.payload?.requestId || 'unknown';
        const now = event.timestamp.getTime();
        const window = this.denyBursts.get(key) || { moduleId: event.moduleId, timestamps: [] };

        window.timestamps = window.timestamps.filter((t) => now - t <= DENY_BURST_WINDOW_MS);
        window.timestamps.push(now);
        this.denyBursts.set(key, window);

        if (window.timestamps.length >= DENY_BURST_THRESHOLD) {
            window.timestamps = [];
            return this.buildInsight(
                event,
                'HIGH',
                `Repeated access denials (${DENY_BURST_THRESHOLD}+) for "${key}" within ${DENY_BURST_WINDOW_MS / 60000} minutes`,
                'REVIEW_ACCOUNT_FOR_COMPROMISE'
            );
        }
        return null;
    }

    private buildInsight(
        event: TelemetryEvent,
        severity: SecurityInsight['severity'],
        description: string,
        recommendedAction?: string
    ): SecurityInsight {
        return {
            insightId: CryptoUtil.randomToken(8),
            sourceModule: event.moduleId,
            severity,
            description,
            recommendedAction
        };
    }
}
