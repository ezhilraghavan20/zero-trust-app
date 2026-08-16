import { IContextInput } from '../contracts';
import { RiskLevel } from '../../module-0-core';

// ISO country codes treated as elevated risk for demonstration purposes
// (e.g. jurisdictions commonly associated with elevated fraud rates).
// In production this would be backed by a maintained threat-intel feed.
const HIGH_RISK_COUNTRIES = new Set(['KP', 'IR', 'SY']);
const ELEVATED_RISK_COUNTRIES = new Set(['RU', 'CN', 'NG']);

/**
 * Extracts and evaluates geolocation-based risk signals.
 */
export class LocationSignal {
    public process(location: IContextInput['location']) {
        const country = location.countryCode?.toUpperCase() || '';
        const isHighRiskZone = HIGH_RISK_COUNTRIES.has(country);
        const isElevatedRiskZone = ELEVATED_RISK_COUNTRIES.has(country);

        let riskLevel: RiskLevel;
        if (isHighRiskZone) {
            riskLevel = RiskLevel.CRITICAL;
        } else if (isElevatedRiskZone) {
            riskLevel = RiskLevel.MEDIUM;
        } else if (!country) {
            riskLevel = RiskLevel.LOW;
        } else {
            riskLevel = RiskLevel.NEGLIGIBLE;
        }

        return {
            country,
            isHighRiskZone,
            riskLevel
        };
    }
}
