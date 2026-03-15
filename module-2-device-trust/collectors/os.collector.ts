import { IDeviceInput } from '../contracts';

/**
 * Normalizes OS health signals.
 */
export class OsCollector {
    public collect(input: IDeviceInput['os']) {
        // TODO: Map raw OS signals to health indicators
        return {
            isSupported: true, // Placeholder
            isUpToDate: input.patchLevel === 'LATEST',
            version: input.version
        };
    }
}
