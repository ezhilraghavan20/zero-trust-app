import { BehaviorAnalyticsService } from '../services';
import { BehaviorAnalyticsInput, BehaviorAnalyticsOutput } from '../contracts';
import { ValidationUtil } from '../../module-0-core/utils';

export class BehaviorAnalyticsController {
    private behaviorService: BehaviorAnalyticsService;

    constructor() {
        this.behaviorService = new BehaviorAnalyticsService();
    }

    /**
     * Handle incoming requests for behavior analysis.
     */
    public handleAnalysisRequest(input: BehaviorAnalyticsInput): BehaviorAnalyticsOutput {
        if (!ValidationUtil.isNonEmptyString(input.identityId)) {
            throw new Error('identityId is required for behavior analysis');
        }
        if (!ValidationUtil.isNonEmptyString(input.action) || !ValidationUtil.isNonEmptyString(input.resource)) {
            throw new Error('action and resource are required for behavior analysis');
        }
        if (!(input.timestamp instanceof Date) || Number.isNaN(input.timestamp.getTime())) {
            throw new Error('A valid timestamp is required for behavior analysis');
        }

        return this.behaviorService.analyzeBehavior(input);
    }
}
