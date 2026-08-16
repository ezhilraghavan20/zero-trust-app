import { MainRouter } from '../router';
import { requestMiddleware, loggingMiddleware, securityHeadersMiddleware, corsMiddleware, apiRateLimiter } from '../middleware';
import path from 'path';
import express from 'express';

/**
 * Application factory and configuration.
 */
export class App {
    private router: MainRouter;

    constructor() {
        this.router = new MainRouter();
    }

    /**
     * Initializes the application and middleware.
     */
    public initialize(app: any): void {
        // Apply global middleware
        app.use(express.json());
        app.use(securityHeadersMiddleware);
        app.use(corsMiddleware);
        app.use(requestMiddleware);
        app.use(loggingMiddleware);
        app.use('/api', apiRateLimiter);

        // Set up routes
        this.router.setupRoutes(app);

        app.use(express.static(path.join(__dirname, '../../module-12-frontend/dist')));
        app.get('*', (_req: any, res: any) => {
            res.sendFile(path.join(__dirname, '../../module-12-frontend/dist/index.html'));
        });
    }
}
