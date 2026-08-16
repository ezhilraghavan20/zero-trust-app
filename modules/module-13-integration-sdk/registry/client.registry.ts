import { ClientType } from '../contracts';
import { CryptoUtil } from '../../module-0-core';

export interface RegisteredClient {
  clientId: string;
  clientType: ClientType;
  isActive: boolean;
  registeredAt: Date;
}

interface InternalClientRecord extends RegisteredClient {
  apiKeyHash?: string;
  certFingerprint?: string;
}

/**
 * In-memory registry of clients authorized to integrate with the platform.
 * Seeded with one demo client per ClientType so each SDK/adapter has a
 * working credential pair out of the box.
 */
export class ClientRegistry {
  private static readonly clients = new Map<string, InternalClientRecord>();
  private static seeded = false;

  constructor() {
    ClientRegistry.seedOnce();
  }

  private static seedOnce(): void {
    if (ClientRegistry.seeded) return;
    ClientRegistry.seeded = true;

    ClientRegistry.register('web-app-demo', ClientType.WEB_APP, { apiKey: 'web-demo-api-key' });
    ClientRegistry.register('mobile-app-demo', ClientType.MOBILE_APP, { apiKey: 'mobile-demo-api-key' });
    ClientRegistry.register('microservice-demo', ClientType.MICROSERVICE, {
      certFingerprint: CryptoUtil.sha256('microservice-demo-cert')
    });
    ClientRegistry.register('iot-device-demo', ClientType.IOT_DEVICE, { apiKey: 'iot-demo-api-key' });
  }

  private static register(
    clientId: string,
    clientType: ClientType,
    secret: { apiKey?: string; certFingerprint?: string }
  ): void {
    ClientRegistry.clients.set(clientId, {
      clientId,
      clientType,
      isActive: true,
      registeredAt: new Date(),
      apiKeyHash: secret.apiKey ? CryptoUtil.sha256(secret.apiKey) : undefined,
      certFingerprint: secret.certFingerprint
    });
  }

  public async getClientInfo(clientId: string): Promise<RegisteredClient | null> {
    const record = ClientRegistry.clients.get(clientId);
    if (!record) return null;
    const { apiKeyHash, certFingerprint, ...publicInfo } = record;
    return publicInfo;
  }

  /** Internal lookup used by validators; not part of the public client-facing shape. */
  public async getSecretMaterial(clientId: string): Promise<{ apiKeyHash?: string; certFingerprint?: string } | null> {
    const record = ClientRegistry.clients.get(clientId);
    if (!record) return null;
    return { apiKeyHash: record.apiKeyHash, certFingerprint: record.certFingerprint };
  }
}
