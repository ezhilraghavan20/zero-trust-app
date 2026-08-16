interface AnalyzerSignals {
    location: { isHighRiskZone: boolean; country: string };
    network: { isTorOrProxy: boolean; isPublicWifi: boolean };
    time: { isBusinessHours: boolean; isImpossibleTravel: boolean };
}

/**
 * Detects environmental irregularities across multiple contextual signals,
 * including correlated multi-signal anomalies.
 */
export class AnomalyAnalyzer {
    public analyze(signals: AnalyzerSignals): string[] {
        const anomalies: string[] = [];

        if (signals.location.isHighRiskZone) {
            anomalies.push('HIGH_RISK_LOCATION');
        }

        if (signals.network.isTorOrProxy) {
            anomalies.push('ANONYMOUS_NETWORK_DETECTED');
        }

        if (signals.time.isImpossibleTravel) {
            anomalies.push('IMPOSSIBLE_TRAVEL');
        }

        if (!signals.time.isBusinessHours) {
            anomalies.push('OFF_HOURS_ACCESS');
        }

        // Correlated anomaly: public wifi + off-hours is a materially higher
        // risk combination than either signal alone.
        if (signals.network.isPublicWifi && !signals.time.isBusinessHours) {
            anomalies.push('PUBLIC_WIFI_OFF_HOURS');
        }

        // Correlated anomaly: anonymized network combined with impossible
        // travel strongly suggests session hijacking or credential theft.
        if (signals.network.isTorOrProxy && signals.time.isImpossibleTravel) {
            anomalies.push('LIKELY_ACCOUNT_TAKEOVER');
        }

        return anomalies;
    }
}
