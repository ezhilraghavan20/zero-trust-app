import { IDeviceInput } from '../contracts';

const SUPPORTED_OS = ['Windows', 'macOS', 'Linux', 'iOS', 'Android'];
const MIN_SUPPORTED_MAJOR_VERSION: Record<string, number> = {
    Windows: 10,
    macOS: 12,
    iOS: 15,
    Android: 11,
    Linux: 0
};

/**
 * Normalizes OS health signals.
 */
export class OsCollector {
    public collect(input: IDeviceInput['os']) {
        const isSupported = SUPPORTED_OS.some((name) => input.name.toLowerCase().includes(name.toLowerCase()));
        const majorVersion = parseInt(String(input.version).split('.')[0], 10) || 0;
        const minSupported = Object.entries(MIN_SUPPORTED_MAJOR_VERSION).find(([name]) =>
            input.name.toLowerCase().includes(name.toLowerCase())
        )?.[1] ?? 0;

        return {
            isSupported: isSupported && majorVersion >= minSupported,
            isUpToDate: input.patchLevel === 'LATEST',
            version: input.version
        };
    }
}
