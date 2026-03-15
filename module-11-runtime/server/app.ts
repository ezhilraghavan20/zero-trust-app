import { MainRouter } from '../router';
import { requestMiddleware, loggingMiddleware } from '../middleware';

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
        app.use(requestMiddleware);
        app.use(loggingMiddleware);

        // Set up routes
        this.router.setupRoutes(app);
    }
}
