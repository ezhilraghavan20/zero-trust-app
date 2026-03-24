/**
 * Base error class for the ZTAC application.
 */
export abstract class ZTACBaseError extends Error {
    public readonly timestamp: string;

    constructor(public readonly message: string, public readonly code: string) {
        super(message);
        this.name = this.constructor.name;
        this.timestamp = new Date().toISOString();
    }
}
