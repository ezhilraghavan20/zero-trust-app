export interface BehaviorAnalyticsOutput {
    identityId: string;
    riskScore: number; // 0 (normal) to 100 (highly anomalous)
    anomaliesDetected: string[];
    baselineConfidence: 'INSUFFICIENT_DATA' | 'LOW' | 'ESTABLISHED';
}
