import { IContextInput } from '../contracts';
import { IRiskSignal, RiskLevel } from '../../module-0-core';

/**
 * Extracts and evaluates geolocation-based risk signals.
 */
export class LocationSignal {
    public process(location: IContextInput['location']) {
        // TODO: Map location to regional risk scores
        return {
            country: location.countryCode,
            isHighRiskZone: false, // Placeholder
            riskLevel: RiskLevel.NEGLIGIBLE
        };
    }
}
