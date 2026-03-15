import { ZTACBaseError } from './base.error';

/**
 * Errors related to policy evaluation and enforcement.
 */
export class PolicyError extends ZTACBaseError {
    constructor(message: string, code: string = 'POLICY_DENIED') {
        super(message, code);
    }
}
