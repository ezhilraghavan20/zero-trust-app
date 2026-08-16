import { EmergencyOverrideRequest } from '../contracts/governance.contract';
import { AuditTrail } from '../audit/audit.trail';
import { TimeUtil } from '../../module-0-core';

interface ActiveOverride {
    targetIdentityId: string;
    grantedBy: string;
    reason: string;
    expiresAt: string;
}

/**
 * Supports emergency ("break-glass") overrides with accountability. Every
 * override is time-bound and unconditionally audited — this class never
 * bypasses enforcement silently; callers (Module 6/7) must explicitly check
 * isOverrideActive() and still log the fact an override was used.
 */
export class OverrideManager {
    private auditTrail: AuditTrail;
    private readonly activeOverrides = new Map<string, ActiveOverride>();
    private readonly maxDurationMinutes = 240; // hard ceiling: 4 hours

    constructor(auditTrail: AuditTrail = new AuditTrail()) {
        this.auditTrail = auditTrail;
    }

    public activateEmergencyOverride(request: EmergencyOverrideRequest): ActiveOverride {
        if (!request.reason || request.reason.trim().length === 0) {
            throw new Error('Emergency overrides require a documented reason');
        }

        const durationMinutes = Math.min(request.durationMinutes, this.maxDurationMinutes);
        const override: ActiveOverride = {
            targetIdentityId: request.targetIdentityId,
            grantedBy: request.adminId,
            reason: request.reason,
            expiresAt: TimeUtil.ttlExpiry(durationMinutes * 60)
        };

        this.activeOverrides.set(request.targetIdentityId, override);

        this.auditTrail.appendRecord(request.adminId, 'ACTIVATED_EMERGENCY_OVERRIDE', {
            ...request,
            durationMinutes,
            expiresAt: override.expiresAt
        });

        return override;
    }

    public isOverrideActive(identityId: string): boolean {
        const override = this.activeOverrides.get(identityId);
        if (!override) return false;
        if (TimeUtil.isExpired(override.expiresAt)) {
            this.activeOverrides.delete(identityId);
            return false;
        }
        return true;
    }

    public revokeOverride(identityId: string, revokedBy: string): void {
        if (this.activeOverrides.delete(identityId)) {
            this.auditTrail.appendRecord(revokedBy, 'REVOKED_EMERGENCY_OVERRIDE', { targetIdentityId: identityId });
        }
    }
}
