/**
 * Weighted configuration for the Trust Score formula (Module 5).
 * Trust Score = ( IT + DT + NT + BT - RS ) / (sum of positive maxes) * 100
 * Kept as versioned, auditable configuration rather than hardcoded in the
 * calculator, per NIST 800-207 "policies defined as code" guidance.
 */
export interface TrustScoreWeights {
    identityTrustMax: number; // IT
    deviceTrustMax: number; // DT
    networkTrustMax: number; // NT (context/network+location+time)
    behaviorTrustMax: number; // BT
    resourceSensitivityMax: number; // RS (penalty)
}

export const trustScoreConfig: TrustScoreWeights = {
    identityTrustMax: 25,
    deviceTrustMax: 25,
    networkTrustMax: 15,
    behaviorTrustMax: 20,
    resourceSensitivityMax: 15
};

export const trustScoreNormalizationDivisor: number =
    trustScoreConfig.identityTrustMax +
    trustScoreConfig.deviceTrustMax +
    trustScoreConfig.networkTrustMax +
    trustScoreConfig.behaviorTrustMax; // 85
