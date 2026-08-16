/**
 * Interface defining environmental context signals.
 */
export interface IContextContract {
    ip: string;
    location: string;
    networkTrust: 'TRUSTED' | 'UNTRUSTED';
    timestamp: string;
}
