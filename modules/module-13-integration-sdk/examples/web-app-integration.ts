import { ZTWebClient } from '../sdk/web';

/**
 * Illustrates how a web application initializes the SDK client and requests
 * access to a protected resource on behalf of a logged-in user.
 */
export async function runWebExample() {
  const client = new ZTWebClient({
    clientId: 'web-app-demo',
    apiKey: 'web-demo-api-key'
  });

  const decision = await client.requestAccess({
    resourceId: 'app/dashboard',
    action: 'get',
    context: {
      ipAddress: '203.0.113.10',
      contextInput: {
        location: { countryCode: 'US', region: 'CA', city: 'San Francisco' },
        network: { ipAddress: '203.0.113.10', connectionType: 'WIFI', isPublicWifi: false, isp: 'Comcast' },
        accessTime: new Date(),
        clientMetadata: { userAgent: 'Mozilla/5.0', requestCorrelationId: 'web-example-1' }
      }
    }
  });

  return decision;
}
