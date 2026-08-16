import { RiskLevel } from '../../module-0-core';

interface PostureSignals {
    os: { isHealthy: boolean; isSupported: boolean };
    security: { isHealthy: boolean; isAvRunning: boolean };
    network: { isSecure: boolean };
}

/**
 * Aggregates signals into a final health and risk assessment using
 * weighted scoring: OS 30, Security 45 (firewall+encryption 30, AV 15), Network 25.
 */
export class PostureEvaluator {
    public evaluate(signals: PostureSignals) {
        let score = 0;

        if (signals.os.isSupported) score += 15;
        if (signals.os.isHealthy) score += 15;

        if (signals.security.isHealthy) score += 30;
        if (signals.security.isAvRunning) score += 15;

        if (signals.network.isSecure) score += 25;

        let posture: 'COMPLIANT' | 'NON_COMPLIANT';
        let riskLevel: RiskLevel;

        if (score >= 80) {
            posture = 'COMPLIANT';
            riskLevel = RiskLevel.NEGLIGIBLE;
        } else if (score >= 60) {
            posture = 'COMPLIANT';
            riskLevel = RiskLevel.LOW;
        } else if (score >= 40) {
            posture = 'NON_COMPLIANT';
            riskLevel = RiskLevel.MEDIUM;
        } else if (score >= 20) {
            posture = 'NON_COMPLIANT';
            riskLevel = RiskLevel.HIGH;
        } else {
            posture = 'NON_COMPLIANT';
            riskLevel = RiskLevel.CRITICAL;
        }

        return { posture, score, riskLevel };
    }
}
