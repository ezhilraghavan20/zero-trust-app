/**
 * Interface defining the policy decision result from the Policy Engine.
 */
export interface IPolicyContract {
    allowed: boolean;
    reason?: string;
    requirements?: string[]; // e.g., 'MFA', 'POSTURE_CHECK'
}
