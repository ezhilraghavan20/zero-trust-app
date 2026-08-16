import { ZTACBaseError } from './base.error';

/**
 * Errors related to device posture collection and evaluation.
 */
export class DeviceError extends ZTACBaseError {
    constructor(message: string, code: string = 'DEVICE_EVALUATION_FAILED') {
        super(message, code);
    }
}
