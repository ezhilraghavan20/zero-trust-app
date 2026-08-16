import { PolicyModificationRequest } from '../contracts/governance.contract';
import { AuditTrail } from '../audit/audit.trail';
import { ApprovalWorkflow } from '../approvals/approval.workflow';

/**
 * Handles human management and updates to Zero Trust policies. Changes are
 * staged here and never applied inline with live user traffic — Module 6's
 * PolicyEngineService reads from its own versioned policy set, which is
 * only updated out-of-band (e.g. a deploy) after governance sign-off.
 *
 * High-risk actions (DELETE, or any change to an admin-tier policy) require
 * multi-party approval before they are considered staged/committable.
 */
export class PolicyEditor {
    private readonly staged = new Map<string, PolicyModificationRequest>();

    constructor(
        private readonly auditTrail: AuditTrail = new AuditTrail(),
        private readonly approvalWorkflow: ApprovalWorkflow = new ApprovalWorkflow()
    ) {}

    public modifyPolicy(request: PolicyModificationRequest): boolean {
        if (!request.justification || request.justification.trim().length < 10) {
            throw new Error('Policy changes require a documented justification (10+ characters)');
        }

        const requiresApproval = request.action === 'DELETE' || String(request.policyId).startsWith('pol-admin');

        if (requiresApproval) {
            const actionId = `policy-change:${request.policyId}:${request.action}`;
            const approved = this.approvalWorkflow.requireApproval(actionId, 2);
            if (!approved) {
                this.auditTrail.appendRecord(request.adminId, 'REQUESTED_POLICY_CHANGE_PENDING_APPROVAL', request);
                return false;
            }
        }

        this.staged.set(request.policyId, request);
        this.auditTrail.appendRecord(request.adminId, `POLICY_${request.action}_STAGED`, request);
        return true;
    }

    public getStagedChanges(): PolicyModificationRequest[] {
        return Array.from(this.staged.values());
    }
}
