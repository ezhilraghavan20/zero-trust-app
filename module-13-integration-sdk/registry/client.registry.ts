import { ClientType } from '../contracts';

export interface RegisteredClient {
  clientId: string;
  clientType: ClientType;
  isActive: boolean;
  registeredAt: Date;
}

export class ClientRegistry {
  // TODO: Implement registry interface to track registered clients
  public getClientInfo(clientId: string): Promise<RegisteredClient | null> {
    throw new Error('Not implemented');
  }
}
