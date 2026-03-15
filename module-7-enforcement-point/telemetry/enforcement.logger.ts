import { EnforcementOutput } from '../contracts';

export class EnforcementLogger {
    /**
     * TODO: Produce telemetry for enforcement outcomes.
     * Audit logs for actions actually taken.
     */
    public log(outcome: EnforcementOutput): void {
        // TODO: emit telemetry events
        console.log(`[ENFORCEMENT] Request ${outcome.requestId} -> ${outcome.enforcedAction}`);
    }
}
