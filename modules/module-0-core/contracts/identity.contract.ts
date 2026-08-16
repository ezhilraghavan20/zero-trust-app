/**
 * Interface defining the identity context from the Identity Module.
 */
export interface IIdentityContract {
    userId: string;
    authenticated: boolean;
    claims: Record<string, any>;
    issuedAt: string;
}
