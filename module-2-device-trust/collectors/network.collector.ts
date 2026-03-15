import { IDeviceInput } from '../contracts';

/**
 * Normalizes network security signals.
 */
export class NetworkCollector {
    public collect(input: IDeviceInput['network']) {
        // TODO: Evaluate network risk signals
        return {
            isAuthorizedNetwork: true, // Placeholder logic
            isVpnMandatory: false,
            currentIp: input.ipAddress
        };
    }
}
