export interface ResourceAccessRequest {
    resourceId: string;
    action: string;
    payload?: any;
    // Metadata forwarded strictly by the Enforcement Point
    enforcementContext: Record<string, any>;
}

export interface ResourceAccessResponse {
    resourceId: string;
    status: 'SUCCESS' | 'FAILURE';
    data?: any;
}
