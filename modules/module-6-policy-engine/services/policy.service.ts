import { PolicyEngineInput, PolicyEngineOutput } from '../contracts';
import { RuleEvaluator } from '../evaluators';
import { DecisionBuilder } from '../decisions';
import { PolicyModel, DEFAULT_POLICIES } from '../policies';

const STEP_UP_BAND_WIDTH = 30; // points below a policy's minTrustScore that still qualify for STEP-UP rather than outright DENY

export class PolicyEngineService {
    private evaluator: RuleEvaluator;
    private decisionBuilder: DecisionBuilder;

    constructor() {
        this.evaluator = new RuleEvaluator();
        this.decisionBuilder = new DecisionBuilder();
    }

    /**
     * Orchestrates policy evaluation: finds all policies whose resource/action
     * patterns apply to this request, picks the highest-priority (most
     * specific) match, then decides ALLOW / STEP-UP / DENY based on how the
     * request's trust score compares to that policy's minTrustScore.
     *
     * Zero Trust default: if no policy matches the resource at all, DENY.
     */
    public evaluatePolicies(input: PolicyEngineInput, policies: PolicyModel[] = DEFAULT_POLICIES): PolicyEngineOutput {
        const applicablePolicies = policies
            .filter((policy) => this.evaluator.matches(input, policy))
            .sort((a, b) => b.priority - a.priority);

        if (applicablePolicies.length === 0) {
            return this.decisionBuilder.buildDecision(
                input.requestId,
                'DENY',
                'Default deny triggered. No matching policy found for this resource/action.',
                []
            );
        }

        const policy = applicablePolicies[0];
        const matchedPolicyIds = applicablePolicies.map((p) => p.id);

        if (this.evaluator.evaluate(input, policy)) {
            return this.decisionBuilder.buildDecision(
                input.requestId,
                policy.effect,
                `Trust score ${input.trustScore} satisfies policy "${policy.name}" (min ${policy.minTrustScore}).`,
                matchedPolicyIds
            );
        }

        if (policy.effect === 'DENY') {
            return this.decisionBuilder.buildDecision(
                input.requestId,
                'DENY',
                `Policy "${policy.name}" explicitly denies this request.`,
                matchedPolicyIds
            );
        }

        const stepUpFloor = Math.max(0, policy.minTrustScore - STEP_UP_BAND_WIDTH);
        if (input.trustScore >= stepUpFloor) {
            return this.decisionBuilder.buildDecision(
                input.requestId,
                'STEP-UP',
                `Trust score ${input.trustScore} is below policy "${policy.name}" threshold (${policy.minTrustScore}) but within step-up range; additional verification required.`,
                matchedPolicyIds
            );
        }

        return this.decisionBuilder.buildDecision(
            input.requestId,
            'DENY',
            `Trust score ${input.trustScore} is too low for policy "${policy.name}" (requires ${policy.minTrustScore}, step-up floor ${stepUpFloor}).`,
            matchedPolicyIds
        );
    }
}
