import { EmergencyOverrideRequest } from '../contracts/governance.contract';
import { AuditTrail } from '../audit/audit.trail';

export class OverrideManager {
    private auditTrail: AuditTrail;

    constructor() {
        this.auditTrail = new AuditTrail();
    }

    /**
     * TODO: Support emergency overrides with accountability (e.g., break-glass accounts).
     * MUST record who did it and why. NEVER bypass automatically.
     */
    public activateEmergencyOverride(request: EmergencyOverrideRequest): void {
        // TODO: apply temporary break-glass state
        this.auditTrail.appendRecord(request.adminId, 'ACTIVATED_EMERGENCY_OVERRIDE', request);
    }
}
