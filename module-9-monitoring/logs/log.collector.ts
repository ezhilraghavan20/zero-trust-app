import { TelemetryEvent } from '../contracts/telemetry.contract';

export class LogCollector {
    /**
     * TODO: Ingest logs and events from all other modules.
     * DO NOT evaluate them for access decisions.
     */
    public ingest(event: TelemetryEvent): void {
        // TODO: store in SIEM or structured logging backend
        console.log(`[LOG] Mod: ${event.moduleId} | Type: ${event.eventType} | At: ${event.timestamp}`);
    }
}
