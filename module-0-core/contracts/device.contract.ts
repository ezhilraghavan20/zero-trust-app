/**
 * Interface defining device trust signals from the Device Trust Module.
 */
export interface IDeviceContract {
    deviceId: string;
    posture: 'COMPLIANT' | 'NON_COMPLIANT';
    score: number;
}
