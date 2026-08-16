import { PolicyModel } from './policy.model';
import { ValidationUtil } from '../../module-0-core';

/**
 * Parses raw policy definitions (JSON/config) into validated PolicyModels,
 * applying sane defaults for optional fields.
 */
export class PolicyParser {
    public parse(rawPolicy: any): PolicyModel {
        if (!rawPolicy || typeof rawPolicy !== 'object') {
            throw new Error('Policy definition must be an object');
        }

        ValidationUtil.assert(ValidationUtil.isNonEmptyString(rawPolicy.id), 'Policy requires an id');
        ValidationUtil.assert(ValidationUtil.isNonEmptyString(rawPolicy.resourcePattern), 'Policy requires a resourcePattern');

        const effect = rawPolicy.effect;
        if (!['ALLOW', 'DENY', 'STEP-UP'].includes(effect)) {
            throw new Error(`Invalid policy effect: ${effect}`);
        }

        const minTrustScore = Number(rawPolicy.minTrustScore);
        ValidationUtil.assert(
            ValidationUtil.isInRange(minTrustScore, 0, 100),
            'Policy minTrustScore must be between 0 and 100'
        );

        return {
            id: rawPolicy.id,
            name: rawPolicy.name || rawPolicy.id,
            resourcePattern: rawPolicy.resourcePattern,
            actionPattern: rawPolicy.actionPattern || '*',
            minTrustScore,
            effect,
            priority: typeof rawPolicy.priority === 'number' ? rawPolicy.priority : 0,
            description: rawPolicy.description
        };
    }

    public parseMany(rawPolicies: any[]): PolicyModel[] {
        return rawPolicies.map((raw) => this.parse(raw));
    }
}
