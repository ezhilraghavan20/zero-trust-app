import { IContextInput, IContextRisk } from '../contracts';
import { ContextService } from '../services';
import { ILogger } from '../../module-0-core';

/**
 * Handles incoming contextual risk evaluation requests.
 */
export class ContextController {
    constructor(
        private contextService: ContextService,
        private logger: ILogger
    ) { }

    /**
     * Evaluates access request context for environmental anomalies.
     */
    public async evaluateRequest(input: IContextInput): Promise<IContextRisk> {
        this.logger.info(`Evaluating context for request: ${input.clientMetadata.requestCorrelationId}`);

        try {
            return await this.contextService.evaluateContext(input);
        } catch (error) {
            this.logger.error(`Context evaluation failed`, error);
            throw error;
        }
    }
}
