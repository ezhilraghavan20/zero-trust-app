/**
 * Runtime module interfaces and types.
 */
export interface IRuntimeConfig {
    port: number;
    host: string;
    env: string;
}

export interface IPipelineOutcome {
    allowed: boolean;
    reason?: string;
    score?: number;
}
