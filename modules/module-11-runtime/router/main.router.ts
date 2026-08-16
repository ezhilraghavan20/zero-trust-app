import { HealthController } from '../health';
import { RequestPipeline } from '../pipeline';
import { AuthController } from '../../module-1-identity/controllers';
import { AuthService } from '../../module-1-identity/services';
import { PasswordProvider, TokenProvider } from '../../module-1-identity/providers';
import { authRateLimiter } from '../middleware';
import { LoggerFactory } from '../../module-0-core';

const logger = LoggerFactory.create('MainRouter');

/**
 * Main router for the application.
 * Dispatches requests to specific modules based on path.
 */
export class MainRouter {
    private healthController: HealthController;
    private pipeline: RequestPipeline;
    private authController: AuthController;

    constructor() {
        this.healthController = new HealthController();
        this.pipeline = new RequestPipeline();
        this.authController = new AuthController(new AuthService(new PasswordProvider(), new TokenProvider()));
    }

    /**
     * Set up routes for the application.
     */
    public setupRoutes(app: any): void {
        console.log('[Router] Registering health check routes');
        // Health check routes
        app.get('/health', (req: any, res: any) => this.healthController.checkHealth(req, res));
        app.get('/health/live', (req: any, res: any) => this.healthController.checkLiveness(req, res));
        app.get('/health/ready', (req: any, res: any) => this.healthController.checkReadiness(req, res));

        // Authentication routes (unprotected — issue the bearer token the
        // Zero Trust pipeline below then verifies on every subsequent call)
        console.log('[Router] Registering auth routes');
        app.post('/api/auth/login', authRateLimiter, this.authController.login);
        app.post('/api/auth/logout', this.authController.logout);
        app.get('/api/auth/me', this.authController.me);

        // Zero Trust API entry point
        app.all(/^\/api\/v1\/.*/, async (req: any, res: any) => {
            try {
                const outcome = await this.pipeline.processRequest(req);
                const status = outcome.statusCode || (outcome.allowed ? 200 : 403);

                res.status(status).json({
                    message: outcome.allowed ? 'Access Granted' : 'Access Denied',
                    pipelineOutcome: outcome,
                    path: req.path
                });
            } catch (error) {
                logger.error('Pipeline execution failed', { requestId: req.id, path: req.path }, error as Error);
                res.status(500).json({ error: 'Internal server error', requestId: req.id });
            }
        });
    }
}
