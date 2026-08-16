import { EnforcementOutput } from '../contracts';
import { LoggerFactory } from '../../module-0-core';

const logger = LoggerFactory.create('EnforcementPoint');

export class EnforcementLogger {
    /**
     * Produce telemetry for enforcement outcomes: a structured audit log
     * entry for every action actually taken, regardless of decision.
     */
    public log(outcome: EnforcementOutput): void {
        const level = outcome.enforcedAction === 'ALLOW' ? 'info' : 'warn';
        logger[level](`Request ${outcome.requestId} enforced as ${outcome.enforcedAction}`, {
            requestId: outcome.requestId,
            enforcedAction: outcome.enforcedAction,
            timestamp: outcome.timestamp.toISOString(),
            statusCode: outcome.responseContext.statusCode
        });
    }
}
