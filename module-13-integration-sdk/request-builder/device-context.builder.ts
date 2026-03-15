import { ClientType } from '../contracts';

export class DeviceContextBuilder {
  // TODO: Extract and normalize device signal context before handing off
  public buildContext(rawDeviceData: any, clientType: ClientType): Record<string, any> {
    throw new Error('Not implemented');
  }
}
