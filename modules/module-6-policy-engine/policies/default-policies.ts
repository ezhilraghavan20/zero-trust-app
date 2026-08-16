import { PolicyModel } from './policy.model';

/**
 * Reference policy set, defined as versioned code per NIST 800-207 guidance.
 * More specific / higher-priority policies are evaluated before general ones.
 */
export const DEFAULT_POLICIES: PolicyModel[] = [
    {
        id: 'pol-admin-panel',
        name: 'Admin Panel Access',
        resourcePattern: 'admin/*',
        actionPattern: '*',
        minTrustScore: 90,
        effect: 'ALLOW',
        priority: 100,
        description: 'Administrative surfaces require near-full trust'
    },
    {
        id: 'pol-sensitive-data',
        name: 'Sensitive Data Access',
        resourcePattern: 'data/sensitive/*',
        actionPattern: '*',
        minTrustScore: 85,
        effect: 'ALLOW',
        priority: 90,
        description: 'Sensitive records require high trust'
    },
    {
        id: 'pol-write-actions',
        name: 'Write / Mutating Actions',
        resourcePattern: '*',
        actionPattern: 'write',
        minTrustScore: 75,
        effect: 'ALLOW',
        priority: 50,
        description: 'Any mutating action requires elevated trust'
    },
    {
        id: 'pol-general-app',
        name: 'General Application Access',
        resourcePattern: '*',
        actionPattern: '*',
        minTrustScore: 50,
        effect: 'ALLOW',
        priority: 0,
        description: 'Default policy for standard application/API resources'
    }
];
