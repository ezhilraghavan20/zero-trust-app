import { RiskLevel, IRiskSignal } from '../../module-0-core';
import { IIdentityContract } from '../../module-0-core';
import { IDevicePosture } from '../../module-2-device-trust';
import { IContextRisk } from '../../module-3-context-engine';
import { BehaviorAnalyticsOutput } from '../../module-4-behavior-analytics';

const RISK_LEVEL_SCORE: Record<RiskLevel, number> = {
    [RiskLevel.NEGLIGIBLE]: 0,
    [RiskLevel.LOW]: 25,
    [RiskLevel.MEDIUM]: 50,
    [RiskLevel.HIGH]: 75,
    [RiskLevel.CRITICAL]: 100
};

/**
 * Converts each module's native output shape into the common IRiskSignal
 * shape that Module 5 (Trust Score Engine) aggregates over. Kept isolated
 * here so no upstream module needs to know about Module 5's contract.
 */
export const SignalMapper = {
    fromIdentity(identity: IIdentityContract | null): IRiskSignal[] {
        if (!identity || !identity.authenticated) {
            return [
                {
                    level: RiskLevel.CRITICAL,
                    score: 100,
                    reason: 'No verified identity presented',
                    timestamp: new Date()
                }
            ];
        }

        const mfaVerified = !!identity.claims?.mfaVerified;
        return [
            {
                level: mfaVerified ? RiskLevel.NEGLIGIBLE : RiskLevel.LOW,
                score: mfaVerified ? 0 : 20,
                reason: mfaVerified ? 'Identity verified with MFA' : 'Identity verified without MFA',
                timestamp: new Date()
            }
        ];
    },

    fromDevice(posture: IDevicePosture | null): IRiskSignal[] {
        if (!posture) {
            return [
                {
                    level: RiskLevel.MEDIUM,
                    score: 50,
                    reason: 'No device posture data available',
                    timestamp: new Date()
                }
            ];
        }

        return [
            {
                level: posture.riskLevel,
                score: RISK_LEVEL_SCORE[posture.riskLevel],
                reason: `Device posture ${posture.posture} (score ${posture.score})`,
                timestamp: posture.lastEvaluatedAt
            }
        ];
    },

    fromContext(context: IContextRisk | null): IRiskSignal[] {
        if (!context) {
            return [
                {
                    level: RiskLevel.MEDIUM,
                    score: 50,
                    reason: 'No context data available',
                    timestamp: new Date()
                }
            ];
        }

        const { locationRisk, networkRisk, timeRisk } = context.riskDetails;
        return [
            {
                level: locationRisk,
                score: RISK_LEVEL_SCORE[locationRisk],
                reason: 'Location risk assessment',
                timestamp: context.evaluatedAt
            },
            {
                level: networkRisk,
                score: RISK_LEVEL_SCORE[networkRisk],
                reason: context.anomaliesDetected.join(', ') || 'Network risk assessment',
                timestamp: context.evaluatedAt
            },
            {
                level: timeRisk,
                score: RISK_LEVEL_SCORE[timeRisk],
                reason: 'Time-of-access risk assessment',
                timestamp: context.evaluatedAt
            }
        ];
    },

    fromBehavior(behavior: BehaviorAnalyticsOutput | null): IRiskSignal[] {
        if (!behavior) {
            return [
                {
                    level: RiskLevel.LOW,
                    score: 25,
                    reason: 'No behavioral baseline available yet',
                    timestamp: new Date()
                }
            ];
        }

        let level: RiskLevel;
        if (behavior.riskScore >= 75) level = RiskLevel.CRITICAL;
        else if (behavior.riskScore >= 50) level = RiskLevel.HIGH;
        else if (behavior.riskScore >= 25) level = RiskLevel.MEDIUM;
        else if (behavior.riskScore > 0) level = RiskLevel.LOW;
        else level = RiskLevel.NEGLIGIBLE;

        return [
            {
                level,
                score: behavior.riskScore,
                reason: behavior.anomaliesDetected.join(', ') || 'No behavioral anomalies detected',
                timestamp: new Date()
            }
        ];
    },

    /**
     * Resource sensitivity is derived from the resource path itself rather
     * than a signal-producing module, since it's a property of the resource
     * being requested, not of the requester.
     *
     * Matching is done on whole path segments (not substrings) so that a
     * resource like "administration/panel" or "data-sensitivity-report"
     * cannot slip past the admin/sensitive tiers the way naive
     * `.includes()`/`.startsWith()` checks previously allowed.
     */
    resourceSensitivitySignal(resourceId: string): IRiskSignal {
        const segments = resourceId.toLowerCase().split('/').filter(Boolean);
        const isAdmin = segments[0] === 'admin' || (segments[0] === 'app' && segments[1] === 'admin');
        const isSensitive = segments[0] === 'data' && (segments[1] === 'sensitive' || segments.includes('sensitive'));
        const isDataResource = segments[0] === 'data';

        if (isAdmin) {
            return { level: RiskLevel.CRITICAL, score: 100, reason: 'SENSITIVITY: admin-tier resource', timestamp: new Date() };
        }
        if (isSensitive) {
            return { level: RiskLevel.CRITICAL, score: 100, reason: 'SENSITIVITY: sensitive data resource', timestamp: new Date() };
        }
        if (isDataResource) {
            return { level: RiskLevel.HIGH, score: 75, reason: 'SENSITIVITY: data resource', timestamp: new Date() };
        }
        return { level: RiskLevel.NEGLIGIBLE, score: 0, reason: 'SENSITIVITY: standard resource', timestamp: new Date() };
    }
};
