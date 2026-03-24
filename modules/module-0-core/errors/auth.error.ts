import { ZTACBaseError } from './base.error';

/**
 * Errors related to authentication and identity verification.
 */
export class AuthError extends ZTACBaseError {
    constructor(message: string, code: string = 'AUTH_FAILURE') {
        super(message, code);
    }
}
