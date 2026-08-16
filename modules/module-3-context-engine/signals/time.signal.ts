import { RiskLevel } from '../../module-0-core';
import { TimeUtil } from '../../module-0-core/utils';

interface LastAccess {
    country: string;
    at: Date;
}

/**
 * Evaluates time-based risk (e.g., impossible travel, unusual hours).
 *
 * Impossible travel is detected by tracking the last known country per
 * identity: two accesses from different countries within an implausibly
 * short window are flagged.
 */
export class TimeSignal {
    private readonly lastAccessByIdentity = new Map<string, LastAccess>();
    private readonly impossibleTravelWindowMinutes = 60;

    public process(accessTime: Date, identityKey: string = 'anonymous', country?: string) {
        const isBusinessHours = TimeUtil.isWithinBusinessHours(accessTime);

        let isImpossibleTravel = false;
        if (country) {
            const last = this.lastAccessByIdentity.get(identityKey);
            if (last && last.country !== country) {
                const minutesElapsed = TimeUtil.secondsBetween(last.at, accessTime) / 60;
                if (minutesElapsed < this.impossibleTravelWindowMinutes) {
                    isImpossibleTravel = true;
                }
            }
            this.lastAccessByIdentity.set(identityKey, { country, at: accessTime });
        }

        let riskLevel: RiskLevel;
        if (isImpossibleTravel) {
            riskLevel = RiskLevel.CRITICAL;
        } else if (!isBusinessHours) {
            riskLevel = RiskLevel.LOW;
        } else {
            riskLevel = RiskLevel.NEGLIGIBLE;
        }

        return {
            isBusinessHours,
            isImpossibleTravel,
            riskLevel
        };
    }
}
