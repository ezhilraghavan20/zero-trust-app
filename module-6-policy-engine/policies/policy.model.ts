export interface PolicyModel {
    id: string;
    name: string;
    resourcePattern: string;
    actionPattern: string;
    minTrustScore: number;
    effect: 'ALLOW' | 'DENY' | 'STEP-UP';
    // TODO: Add more policy constraints as needed
}
