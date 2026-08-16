import { ScoreEngineService } from '../services';
import { ScoreEngineInput, ScoreEngineOutput } from '../contracts';
import { ValidationUtil } from '../../module-0-core';

export class ScoreEngineController {
    private scoreService: ScoreEngineService;

    constructor() {
        this.scoreService = new ScoreEngineService();
    }

    /**
     * Handle incoming requests to evaluate trust for a transaction or request.
     */
    public handleScoreRequest(input: ScoreEngineInput): ScoreEngineOutput {
        ValidationUtil.assert(ValidationUtil.isNonEmptyString(input.requestId), 'requestId is required');
        ValidationUtil.assert(ValidationUtil.isNonEmptyString(input.identityId), 'identityId is required');
        ValidationUtil.assert(Array.isArray(input.identitySignals), 'identitySignals must be an array');
        ValidationUtil.assert(Array.isArray(input.deviceSignals), 'deviceSignals must be an array');
        ValidationUtil.assert(Array.isArray(input.contextSignals), 'contextSignals must be an array');
        ValidationUtil.assert(Array.isArray(input.behaviorSignals), 'behaviorSignals must be an array');

        return this.scoreService.evaluateTrust(input);
    }
}
