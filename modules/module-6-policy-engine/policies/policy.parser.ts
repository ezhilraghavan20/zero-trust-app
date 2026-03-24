import { PolicyModel } from './policy.model';

export class PolicyParser {
    /**
     * TODO: Parse raw policy definitions (e.g., from JSON or config) into PolicyModels.
     */
    public parse(rawPolicy: any): PolicyModel {
        // TODO: mapping logic
        return {
            id: 'default',
            name: 'Default Deny',
            resourcePattern: '*',
            actionPattern: '*',
            minTrustScore: 100,
            effect: 'DENY'
        };
    }
}
