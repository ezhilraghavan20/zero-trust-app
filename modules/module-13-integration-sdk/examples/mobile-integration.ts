import { ZTMobileClient } from '../sdk/mobile';

/**
 * Illustrates how a mobile application initializes its SDK client and
 * submits device posture alongside the access request.
 */
export async function runMobileExample() {
  const client = new ZTMobileClient({
    clientId: 'mobile-app-demo',
    apiKey: 'mobile-demo-api-key'
  });

  const decision = await client.requestAccess({
    resourceId: 'app/wallet',
    action: 'post',
    deviceContext: {
      deviceId: 'mobile-device-001',
      os: { name: 'iOS', version: '17', patchLevel: 'LATEST' },
      security: { firewallEnabled: true, diskEncryptionActive: true, antivirusStatus: 'ACTIVE' },
      network: { ipAddress: '198.51.100.5', isVpnActive: false, macAddress: 'AA:BB:CC:DD:EE:FF' }
    }
  });

  return decision;
}
