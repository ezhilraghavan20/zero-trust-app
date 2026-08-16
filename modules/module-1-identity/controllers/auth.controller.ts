import { Request, Response } from 'express';
import { AuthService } from '../services';
import { AuthError } from '../../module-0-core/errors';
import { LoggerFactory } from '../../module-0-core/logger';

const logger = LoggerFactory.create('AuthController');

/**
 * Controller for handling authentication requests.
 */
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.authService.login(req.body || {});
            if (!result.success && result.mfaRequired) {
                res.status(200).json({ mfaRequired: true, mfaType: result.mfaType });
                return;
            }
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof AuthError) {
                logger.warn('Login failed', { code: error.code });
                res.status(401).json({ success: false, error: error.message, code: error.code });
                return;
            }
            logger.error('Unexpected login error', undefined, error as Error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    };

    logout = async (req: Request, res: Response): Promise<void> => {
        try {
            const sessionId = req.body?.refreshToken || req.headers['x-refresh-token'];
            if (sessionId) {
                await this.authService.logout(String(sessionId));
            }
            res.status(200).json({ success: true });
        } catch (error) {
            logger.error('Logout error', undefined, error as Error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    };

    me = async (req: Request, res: Response): Promise<void> => {
        try {
            const authHeader = req.headers.authorization || '';
            const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
            if (!token) {
                res.status(401).json({ error: 'Missing bearer token' });
                return;
            }
            const identity = await this.authService.verifyAccessToken(token);
            res.status(200).json(identity);
        } catch (error) {
            res.status(401).json({ error: 'Invalid or expired token' });
        }
    };
}
