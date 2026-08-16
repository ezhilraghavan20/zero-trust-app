export interface ScoreEngineOutput {
    requestId: string;
    identityId: string;
    trustScore: number; // Normalized 0-100
    confidenceLabel: string; // e.g., 'HIGH', 'MEDIUM', 'LOW'
    explanation: Record<string, any>; // Reasoning metadata
}
