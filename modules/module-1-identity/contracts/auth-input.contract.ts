/**
 * Input contract for the authentication process.
 */
export interface AuthInput {
    username?: string;
    email?: string;
    password?: string;
    mfaToken?: string;
    // TODO: Add support for biometric/webauthn challenge responses
}
