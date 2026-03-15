import { PolicyEngineInput, PolicyEngineOutput } from '../contracts';
import { RuleEvaluator } from '../evaluators';
import { DecisionBuilder } from '../decisions';
import { PolicyModel } from '../policies/policy.model';

export class PolicyEngineService {
    private evaluator: RuleEvaluator;
    private decisionBuilder: DecisionBuilder;

    constructor() {
        this.evaluator = new RuleEvaluator();
        this.decisionBuilder = new DecisionBuilder();
    }

    /**
     * TODO: Orchestrate policy evaluation.
     * Fetch applicable policies, evaluate them against input, and build decision.
     */
    public evaluatePolicies(input: PolicyEngineInput, policies: PolicyModel[]): PolicyEngineOutput {
        // TODO: implement logic

        // Default fallback
        return this.decisionBuilder.buildDecision(
            input.requestId,
            'DENY',
            'Default deny triggered. No matching policy found or trust score too low.',
            []
        );
    }
}
