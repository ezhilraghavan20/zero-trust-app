import { ZTServiceClient } from '../sdk/service';

/**
 * Illustrates how a backend microservice uses the SDK client with an mTLS
 * client certificate instead of an API key.
 */
export async function runMicroserviceExample() {
  const client = new ZTServiceClient({
    clientId: 'microservice-demo',
    clientCert: 'microservice-demo-cert'
  });

  const decision = await client.requestAccess({
    resourceId: 'data/orders',
    action: 'get'
  });

  return decision;
}
