import { TelemetryEvent } from '../contracts/telemetry.contract';

const VALID_EVENT_TYPES = new Set(['LOG', 'ALERT', 'SIGNAL']);

/**
 * Normalizes disparate log formats from different modules into the common
 * TelemetryEvent schema, tolerating a variety of raw shapes (module name
 * under different keys, string/Date timestamps, missing fields).
 */
export class TelemetryNormalizer {
    public normalize(rawLog: any): TelemetryEvent {
        const moduleId = rawLog.moduleId || rawLog.source || rawLog.module || 'unknown';

        let eventType: TelemetryEvent['eventType'] = 'LOG';
        if (typeof rawLog.eventType === 'string' && VALID_EVENT_TYPES.has(rawLog.eventType.toUpperCase())) {
            eventType = rawLog.eventType.toUpperCase() as TelemetryEvent['eventType'];
        } else if (rawLog.level === 'warn' || rawLog.level === 'error') {
            eventType = 'ALERT';
        }

        let timestamp: Date;
        if (rawLog.timestamp instanceof Date) {
            timestamp = rawLog.timestamp;
        } else if (typeof rawLog.timestamp === 'string' && !Number.isNaN(Date.parse(rawLog.timestamp))) {
            timestamp = new Date(rawLog.timestamp);
        } else {
            timestamp = new Date();
        }

        const { moduleId: _m, source: _s, module: _mod, eventType: _e, timestamp: _t, ...rest } = rawLog;

        return {
            moduleId,
            eventType,
            timestamp,
            payload: Object.keys(rest).length > 0 ? rest : rawLog
        };
    }
}
