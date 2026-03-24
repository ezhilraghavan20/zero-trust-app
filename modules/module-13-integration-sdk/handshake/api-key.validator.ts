import { IntegrationCredentials } from '../contracts';

export class ApiKeyValidator {
  // TODO: Validate API key without exposing secrets
  public validate(credentials: IntegrationCredentials): Promise<boolean> {
    throw new Error('Not implemented');
  }
}
