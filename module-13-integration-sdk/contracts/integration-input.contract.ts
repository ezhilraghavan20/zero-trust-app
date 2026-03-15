import { ClientType } from './client-type.enum';

export interface IntegrationCredentials {
  apiKey?: string;
  clientCert?: string;
  clientId: string;
}

export interface AccessRequestPayload {
  resourceId: string;
  action: string;
  context?: Record<string, any>;
  deviceContext?: Record<string, any>;
}

export interface BaseIntegrationRequest {
  clientType: ClientType;
  credentials: IntegrationCredentials;
  payload: AccessRequestPayload;
}
