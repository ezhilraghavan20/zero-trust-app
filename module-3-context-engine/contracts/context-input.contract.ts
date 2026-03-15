/**
 * Raw contextual data collected at the time of access.
 */
export interface IContextInput {
    location: {
        countryCode: string;
        region: string;
        city: string;
    };
    network: {
        ipAddress: string;
        connectionType: 'WIFI' | 'ETHERNET' | 'CELLULAR';
        isPublicWifi: boolean;
        isp: string;
    };
    accessTime: Date;
    clientMetadata: {
        userAgent: string;
        requestCorrelationId: string;
    };
}
