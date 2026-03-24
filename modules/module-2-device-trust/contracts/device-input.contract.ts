/**
 * Raw posture data received from the device agent or collector.
 */
export interface IDeviceInput {
    deviceId: string;
    deviceType: 'LAPTOP' | 'MOBILE' | 'SERVER';
    os: {
        name: string;
        version: string;
        patchLevel: string;
    };
    security: {
        firewallEnabled: boolean;
        diskEncryptionActive: boolean;
        antivirusStatus: 'ACTIVE' | 'INACTIVE' | 'OUTDATED';
    };
    network: {
        ipAddress: string;
        isVpnActive: boolean;
        macAddress: string;
    };
}
