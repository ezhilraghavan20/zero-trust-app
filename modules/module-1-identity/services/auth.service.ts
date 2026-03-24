import { AuthInput, AuthOutput } from '../contracts';
import { PasswordProvider, TokenProvider } from '../providers';

/**
 * Service for orchestrating the authentication lifecycle.
 */
export class AuthService {
    constructor(
        private readonly passwordProvider: PasswordProvider,
        private readonly tokenProvider: TokenProvider
    ) { }

    // TODO: Implement login sequence (Verification -> Signal Emission -> Token Issuance)
    // async login(input: AuthInput): Promise<AuthOutput>
    // async logout(sessionId: string): Promise<void>
}
