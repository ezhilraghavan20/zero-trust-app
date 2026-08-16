import { IDeviceInput } from '../contracts';

/**
 * Normalizes security health signals.
 */
export class SecurityCollector {
    public collect(input: IDeviceInput['security']) {
        const isFirewallActive = input.firewallEnabled;
        const isEncrypted = input.diskEncryptionActive;
        const isAvRunning = input.antivirusStatus === 'ACTIVE';
        const isAvOutdated = input.antivirusStatus === 'OUTDATED';

        // A device is fully compliant only when all three security controls
        // are active; an outdated AV counts as partial (not full) protection.
        const isFullyCompliant = isFirewallActive && isEncrypted && isAvRunning;

        return {
            isFirewallActive,
            isEncrypted,
            isAvRunning,
            isAvOutdated,
            isFullyCompliant
        };
    }
}
