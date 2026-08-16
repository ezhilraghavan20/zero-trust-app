/**
 * Input contract for the authentication process.
 */
export interface AuthInput {
    username?: string;
    email?: string;
    password?: string;
    mfaToken?: string;
    webauthnAssertion?: {
        credentialId: string;
        signature: string;
        clientDataJSON: string;
    };
}
