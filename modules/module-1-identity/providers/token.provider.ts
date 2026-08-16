import { CryptoUtil } from '../../module-0-core/utils';
import { TimeUtil } from '../../module-0-core/utils';
import { securityConfig } from '../../module-0-core/config';

export interface TokenPayload {
    userId: string;
    role: string;
    [key: string]: any;
}

interface SignedTokenBody extends TokenPayload {
    iat: string;
    exp: string;
}

/**
 * Provider for token operations (JWT-style issuance, verification, rotation).
 *
 * Implements a compact HMAC-SHA256 signed token (header-less JWS analogue)
 * using only Node's built-in `crypto` module, avoiding a dependency on the
 * `jsonwebtoken` package. Format: base64url(payload).hex(hmacSignature)
 */
export class TokenProvider {
    private readonly secret: string;

    constructor(secret: string = securityConfig.jwtSecret) {
        this.secret = secret;
    }

    async sign(payload: TokenPayload, ttlSeconds: number = securityConfig.accessTokenTtlSeconds): Promise<string> {
        const body: SignedTokenBody = {
            ...payload,
            iat: TimeUtil.nowIso(),
            exp: TimeUtil.ttlExpiry(ttlSeconds)
        };
        const encoded = Buffer.from(JSON.stringify(body)).toString('base64url');
        const signature = CryptoUtil.hmacSign(encoded, this.secret);
        return `${encoded}.${signature}`;
    }

    async verify(token: string): Promise<SignedTokenBody> {
        const [encoded, signature] = (token || '').split('.');
        if (!encoded || !signature) {
            throw new Error('Malformed token');
        }
        if (!CryptoUtil.hmacVerify(encoded, signature, this.secret)) {
            throw new Error('Invalid token signature');
        }
        const body = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SignedTokenBody;
        if (TimeUtil.isExpired(body.exp)) {
            throw new Error('Token expired');
        }
        return body;
    }

    async decode(token: string): Promise<SignedTokenBody | null> {
        try {
            const [encoded] = (token || '').split('.');
            if (!encoded) return null;
            return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
        } catch {
            return null;
        }
    }
}
