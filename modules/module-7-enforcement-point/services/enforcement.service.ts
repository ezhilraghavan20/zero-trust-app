import { EnforcementInput, EnforcementOutput } from '../contracts';
import { AllowHandler, DenyHandler, StepUpHandler } from '../handlers';
import { EnforcementLogger } from '../telemetry';

export class EnforcementService {
    private allowHandler: AllowHandler;
    private denyHandler: DenyHandler;
    private stepUpHandler: StepUpHandler;
    private logger: EnforcementLogger;

    constructor() {
        this.allowHandler = new AllowHandler();
        this.denyHandler = new DenyHandler();
        this.stepUpHandler = new StepUpHandler();
        this.logger = new EnforcementLogger();
    }

    /**
     * TODO: Orchestrate enforcement based on the policy decision.
     */
    public enforce(input: EnforcementInput): EnforcementOutput {
        let outcome: EnforcementOutput;

        switch (input.decision) {
            case 'ALLOW':
                outcome = this.allowHandler.handle(input);
                break;
            case 'DENY':
                outcome = this.denyHandler.handle(input);
                break;
            case 'STEP-UP':
                outcome = this.stepUpHandler.handle(input);
                break;
            default:
                // Default deny on unknown decisions
                outcome = this.denyHandler.handle(input);
        }

        this.logger.log(outcome);
        return outcome;
    }
}
