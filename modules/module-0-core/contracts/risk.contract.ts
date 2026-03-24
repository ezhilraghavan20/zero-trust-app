import { RiskLevel } from '../constants';

/**
 * Base interface for all risk-contributing signals across modules.
 */
export interface IRiskSignal {
    level: RiskLevel;
    score: number;
    reason?: string;
    timestamp: Date;
}
