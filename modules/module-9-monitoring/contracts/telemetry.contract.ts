export interface TelemetryEvent {
    moduleId: string;
    eventType: 'LOG' | 'ALERT' | 'SIGNAL';
    timestamp: Date;
    payload: Record<string, any>;
}

export interface SecurityInsight {
    insightId: string;
    sourceModule: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    recommendedAction?: string;
}
