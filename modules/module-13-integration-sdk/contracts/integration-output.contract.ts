export interface AccessDecisionResponse {
  allowed: boolean;
  reason?: string;
  stepUpRequired?: boolean;
  stepUpType?: string;
  transactionId: string;
}

export interface HandshakeResponse {
  sessionId: string;
  expiresAt: number;
}
