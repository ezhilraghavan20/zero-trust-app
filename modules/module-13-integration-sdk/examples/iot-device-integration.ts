import { ZTIotClient } from '../sdk/iot';

/**
 * Illustrates how an IoT device requests access using minimal device
 * telemetry and no rich contextual signals.
 */
export async function runIotExample() {
  const client = new ZTIotClient({
    clientId: 'iot-device-demo',
    apiKey: 'iot-demo-api-key'
  });

  const decision = await client.requestAccess({
    resourceId: 'telemetry/ingest',
    action: 'post',
    deviceContext: {
      deviceId: 'sensor-042',
      network: { ipAddress: '192.0.2.20', isVpnActive: true, macAddress: '11:22:33:44:55:66' }
    }
  });

  return decision;
}
