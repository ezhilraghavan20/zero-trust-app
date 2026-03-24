import { ScoreEngineService } from '../services';
import { ScoreEngineInput, ScoreEngineOutput } from '../contracts';

export class ScoreEngineController {
    private scoreService: ScoreEngineService;

    constructor() {
        this.scoreService = new ScoreEngineService();
    }

    /**
     * TODO: Handle incoming requests to evaluate trust for a transaction or request.
     */
    public handleScoreRequest(input: ScoreEngineInput): ScoreEngineOutput {
        // TODO: sanitize, validate, authorize locally
        return this.scoreService.evaluateTrust(input);
    }
}
