import { IntegrationCredentials } from '../contracts';
import { CryptoUtil } from '../../module-0-core';
import { ClientRegistry } from '../registry';

/**
 * Validates client certificates for mTLS-based clients (typically
 * microservices). This simulates certificate verification by comparing a
 * fingerprint of the presented cert against the one recorded at
 * registration time — a real deployment would verify the cert chain against
 * a trusted CA at the TLS termination layer and pass through the verified
 * subject here.
 */
export class ClientCertValidator {
  private readonly registry = new ClientRegistry();

  public async validate(credentials: IntegrationCredentials): Promise<boolean> {
    if (!credentials.clientCert) return false;

    const secret = await this.registry.getSecretMaterial(credentials.clientId);
    if (!secret?.certFingerprint) return false;

    const presentedFingerprint = CryptoUtil.sha256(credentials.clientCert);
    return presentedFingerprint === secret.certFingerprint;
  }
}
