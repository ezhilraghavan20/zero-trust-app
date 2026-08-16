export interface PolicyModel {
    id: string;
    name: string;
    resourcePattern: string; // supports '*' wildcard, e.g. 'admin/*'
    actionPattern: string; // supports '*' wildcard, e.g. 'read' | '*'
    minTrustScore: number;
    effect: 'ALLOW' | 'DENY' | 'STEP-UP';
    priority: number; // higher priority evaluated first when multiple policies match
    description?: string;
}
