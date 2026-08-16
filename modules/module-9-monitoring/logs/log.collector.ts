import { TelemetryEvent } from '../contracts/telemetry.contract';
import { LoggerFactory } from '../../module-0-core';

const logger = LoggerFactory.create('LogCollector');
const MAX_BUFFER = 5000;

/**
 * Ingests logs and events from all other modules into a structured,
 * queryable buffer. This is a pure sink — it never evaluates events for
 * access decisions (that is Module 6/7's job).
 */
export class LogCollector {
    private readonly buffer: TelemetryEvent[] = [];

    public ingest(event: TelemetryEvent): void {
        this.buffer.push(event);
        if (this.buffer.length > MAX_BUFFER) {
            this.buffer.shift();
        }

        logger.info(`[${event.moduleId}] ${event.eventType}`, {
            moduleId: event.moduleId,
            eventType: event.eventType,
            timestamp: event.timestamp.toISOString()
        });
    }

    public query(filter: { moduleId?: string; eventType?: TelemetryEvent['eventType']; since?: Date } = {}): TelemetryEvent[] {
        return this.buffer.filter((event) => {
            if (filter.moduleId && event.moduleId !== filter.moduleId) return false;
            if (filter.eventType && event.eventType !== filter.eventType) return false;
            if (filter.since && event.timestamp < filter.since) return false;
            return true;
        });
    }

    public recent(count: number = 100): TelemetryEvent[] {
        return this.buffer.slice(-count);
    }
}

export const logCollector = new LogCollector();
