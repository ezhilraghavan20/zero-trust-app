import { ClientType } from '../contracts';

export interface IntegrationManifest {
  version: string;
  supportedClients: ClientType[];
  endpoints: {
    runtimeApi: string;
  };
}

export const CURRENT_MANIFEST: IntegrationManifest = {
  version: '1.0.0',
  supportedClients: [
    ClientType.WEB_APP,
    ClientType.MOBILE_APP,
    ClientType.MICROSERVICE,
    ClientType.IOT_DEVICE
  ],
  endpoints: {
    runtimeApi: '/api/v1/runtime'
  }
};
