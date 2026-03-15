export interface PolicyEngineInput {
    requestId: string;
    identityId: string;
    resourceId: string;
    action: string;
    trustScore: number; // Injected from Module 5 Output
    // TODO: Add other contextual metadata if required by policy definitions
}
