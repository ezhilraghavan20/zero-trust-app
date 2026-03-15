export interface BehaviorAnalyticsInput {
    identityId: string;
    // TODO: Add inputs from Module 1 (Identity), Module 2 (Device), Module 3 (Context)
    // as needed for evaluation.
    action: string;
    resource: string;
    timestamp: Date;
}
