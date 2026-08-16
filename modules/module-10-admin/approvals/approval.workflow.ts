interface PendingApproval {
    approversRequired: number;
    approvedBy: Set<string>;
}

/**
 * Manages multi-party approvals for high-risk policy changes or overrides.
 * No sensitive governance action executes until it has been explicitly
 * approved by the required number of distinct approvers.
 */
export class ApprovalWorkflow {
    private readonly pending = new Map<string, PendingApproval>();

    /**
     * Registers (or re-checks) an approval requirement for an action.
     * Returns whether the action is already fully approved.
     */
    public requireApproval(actionId: string, approversRequired: number): boolean {
        if (!this.pending.has(actionId)) {
            this.pending.set(actionId, { approversRequired: Math.max(1, approversRequired), approvedBy: new Set() });
        }
        return this.isApproved(actionId);
    }

    public approve(actionId: string, approverId: string): boolean {
        const entry = this.pending.get(actionId);
        if (!entry) return false;
        entry.approvedBy.add(approverId);
        return this.isApproved(actionId);
    }

    public isApproved(actionId: string): boolean {
        const entry = this.pending.get(actionId);
        if (!entry) return false;
        return entry.approvedBy.size >= entry.approversRequired;
    }

    public getStatus(actionId: string): { approversRequired: number; approvedCount: number; approved: boolean } | null {
        const entry = this.pending.get(actionId);
        if (!entry) return null;
        return {
            approversRequired: entry.approversRequired,
            approvedCount: entry.approvedBy.size,
            approved: this.isApproved(actionId)
        };
    }
}
