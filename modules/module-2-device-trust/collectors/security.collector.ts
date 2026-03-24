import { IDeviceInput } from '../contracts';

/**
 * Normalizes security health signals.
 */
export class SecurityCollector {
    public collect(input: IDeviceInput['security']) {
        // TODO: Map security features to compliance signals
        return {
            isFirewallActive: input.firewallEnabled,
            isEncrypted: input.diskEncryptionActive,
            isAvRunning: input.antivirusStatus === 'ACTIVE'
        };
    }
}
