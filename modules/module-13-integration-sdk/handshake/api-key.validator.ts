import * as crypto from 'crypto';
import { IntegrationCredentials } from '../contracts';
import { CryptoUtil } from '../../module-0-core';
import { ClientRegistry } from '../registry';

export class ApiKeyValidator {
  private readonly registry = new ClientRegistry();

  /**
   * Validates an API key by comparing its hash against the stored hash —
   * the raw key is never persisted, so a leak of the registry can't expose it.
   */
  public async validate(credentials: IntegrationCredentials): Promise<boolean> {
    if (!credentials.apiKey) return false;

    const secret = await this.registry.getSecretMaterial(credentials.clientId);
    if (!secret?.apiKeyHash) return false;

    const providedHash = CryptoUtil.sha256(credentials.apiKey);
    const expected = Buffer.from(secret.apiKeyHash, 'hex');
    const provided = Buffer.from(providedHash, 'hex');
    if (expected.length !== provided.length) return false;

    return crypto.timingSafeEqual(expected, provided);
  }
}
