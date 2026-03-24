import { BehaviorAnalyticsService } from '../services';
import { BehaviorAnalyticsInput, BehaviorAnalyticsOutput } from '../contracts';

export class BehaviorAnalyticsController {
    private behaviorService: BehaviorAnalyticsService;

    constructor() {
        this.behaviorService = new BehaviorAnalyticsService();
    }

    /**
     * TODO: Handle incoming requests for behavior analysis.
     */
    public handleAnalysisRequest(input: BehaviorAnalyticsInput): BehaviorAnalyticsOutput {
        // TODO: input validation
        return this.behaviorService.analyzeBehavior(input);
    }
}
