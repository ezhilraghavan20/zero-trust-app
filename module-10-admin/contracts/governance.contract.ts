export interface PolicyModificationRequest {
    adminId: string;
    policyId: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    payload: any;
    justification: string;
}

export interface EmergencyOverrideRequest {
    adminId: string;
    targetIdentityId: string;
    durationMinutes: number;
    reason: string;
}
