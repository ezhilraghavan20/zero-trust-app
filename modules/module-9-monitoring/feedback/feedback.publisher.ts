import { EventEmitter } from 'events';
import { SecurityInsight } from '../contracts/telemetry.contract';

export type InsightSubscriber = (insight: SecurityInsight) => void;

/**
 * Publishes security insights back to upstream modules (e.g. Context Engine,
 * Behavior Analytics) forming the closed-loop learning mechanism of Zero
 * Trust: monitoring observes outcomes, and feeds signal back "upstream"
 * without itself ever making an enforcement decision.
 */
export class FeedbackPublisher {
    private readonly emitter = new EventEmitter();
    private readonly EVENT_NAME = 'security-insight';

    public publish(insight: SecurityInsight): void {
        this.emitter.emit(this.EVENT_NAME, insight);
    }

    public subscribe(handler: InsightSubscriber): () => void {
        this.emitter.on(this.EVENT_NAME, handler);
        return () => this.emitter.off(this.EVENT_NAME, handler);
    }
}

export const feedbackPublisher = new FeedbackPublisher();
