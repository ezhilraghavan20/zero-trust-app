import { IDeviceInput } from '../contracts';

const PRIVATE_IP_RANGES = [/^10\./, /^192\.168\./, /^172\.(1[6-9]|2\d|3[0-1])\./];

/**
 * Normalizes network security signals.
 */
export class NetworkCollector {
    public collect(input: IDeviceInput['network']) {
        const isPrivateNetwork = PRIVATE_IP_RANGES.some((pattern) => pattern.test(input.ipAddress));
        // A device is on an authorized network if it's on the private corporate
        // range, or connecting from anywhere while tunneled through the VPN.
        const isAuthorizedNetwork = isPrivateNetwork || input.isVpnActive;

        return {
            isAuthorizedNetwork,
            isVpnMandatory: !isPrivateNetwork,
            isVpnActive: input.isVpnActive,
            currentIp: input.ipAddress
        };
    }
}
