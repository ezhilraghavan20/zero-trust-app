export interface PolicyEngineInput {
    requestId: string;
    identityId: string;
    resourceId: string;
    action: string;
    trustScore: number; // Injected from Module 5 Output
    metadata?: Record<string, any>; // Optional contextual metadata (device/context flags) for future policy conditions
}
