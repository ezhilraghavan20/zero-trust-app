import { HealthController } from '../health';
import { RequestPipeline } from '../pipeline';

/**
 * Main router for the application.
 * Dispatches requests to specific modules based on path.
 */
export class MainRouter {
    private healthController: HealthController;
    private pipeline: RequestPipeline;

    constructor() {
        this.healthController = new HealthController();
        this.pipeline = new RequestPipeline();
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

        // Zero Trust API entry point
        app.all(/^\/api\/v1\/.*/, async (req: any, res: any) => {
            try {
                const outcome = await this.pipeline.processRequest(req);
                const status = outcome.allowed ? 200 : 403;

                res.status(status).json({
                    message: outcome.allowed ? 'Access Granted' : 'Access Denied',
                    pipelineOutcome: outcome,
                    path: req.path
                });
            } catch (error) {
                res.status(500).json({ error: 'Pipeline Execution Failed' });
            }
        });
    }
}
