import { IntegrationCredentials, HandshakeResponse } from '../contracts';
import { CryptoUtil } from '../../module-0-core';
import { ApiKeyValidator } from './api-key.validator';
import { ClientCertValidator } from './client-cert.validator';

interface SessionRecord {
  clientId: string;
  expiresAt: number;
}

const SESSION_TTL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Establishes an integration session after validating credentials, so
 * repeat requests within the session window can skip full re-validation.
 */
export class SessionNegotiator {
  private static readonly sessions = new Map<string, SessionRecord>();

  private readonly apiKeyValidator = new ApiKeyValidator();
  private readonly certValidator = new ClientCertValidator();

  public async negotiate(credentials: IntegrationCredentials): Promise<HandshakeResponse> {
    const isValid = credentials.apiKey
      ? await this.apiKeyValidator.validate(credentials)
      : await this.certValidator.validate(credentials);

    if (!isValid) {
      throw new Error('Handshake failed: invalid credentials');
    }

    const sessionId = CryptoUtil.randomToken(24);
    const expiresAt = Date.now() + SESSION_TTL_MS;
    SessionNegotiator.sessions.set(sessionId, { clientId: credentials.clientId, expiresAt });

    return { sessionId, expiresAt };
  }

  public static isSessionValid(sessionId: string): boolean {
    const session = SessionNegotiator.sessions.get(sessionId);
    if (!session) return false;
    if (session.expiresAt < Date.now()) {
      SessionNegotiator.sessions.delete(sessionId);
      return false;
    }
    return true;
  }
}
