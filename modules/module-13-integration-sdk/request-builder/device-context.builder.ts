import { ClientType } from '../contracts';

/**
 * Normalizes raw, client-type-specific device telemetry into the shape
 * Module 2 (Device Trust) expects. IoT devices in particular rarely report
 * full OS/security telemetry, so sensible conservative defaults are used
 * (unset fields end up scored as non-compliant rather than silently trusted).
 */
export class DeviceContextBuilder {
  public buildContext(rawDeviceData: any, clientType: ClientType): Record<string, any> {
    const data = rawDeviceData || {};

    const base = {
      deviceId: data.deviceId || `${clientType.toLowerCase()}-unknown`,
      deviceType: this.mapDeviceType(clientType),
      os: {
        name: data.os?.name || data.osName || 'unknown',
        version: data.os?.version || data.osVersion || '0',
        patchLevel: data.os?.patchLevel || 'UNKNOWN'
      },
      security: {
        firewallEnabled: !!(data.security?.firewallEnabled ?? data.firewallEnabled),
        diskEncryptionActive: !!(data.security?.diskEncryptionActive ?? data.diskEncryptionActive),
        antivirusStatus: data.security?.antivirusStatus || data.antivirusStatus || 'INACTIVE'
      },
      network: {
        ipAddress: data.network?.ipAddress || data.ipAddress || '0.0.0.0',
        isVpnActive: !!(data.network?.isVpnActive ?? data.isVpnActive),
        macAddress: data.network?.macAddress || data.macAddress || '00:00:00:00:00:00'
      }
    };

    return base;
  }

  private mapDeviceType(clientType: ClientType): 'LAPTOP' | 'MOBILE' | 'SERVER' {
    switch (clientType) {
      case ClientType.MOBILE_APP:
        return 'MOBILE';
      case ClientType.MICROSERVICE:
      case ClientType.IOT_DEVICE:
        return 'SERVER';
      case ClientType.WEB_APP:
      default:
        return 'LAPTOP';
    }
  }
}
