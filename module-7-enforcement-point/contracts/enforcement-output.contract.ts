export interface EnforcementOutput {
    requestId: string;
    enforcedAction: 'ALLOW' | 'DENY' | 'STEP-UP';
    timestamp: Date;
    // Metadata for the framework (e.g., HTTP status code or redirect URL)
    responseContext: Record<string, any>;
}
