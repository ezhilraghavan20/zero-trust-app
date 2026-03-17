import { App } from './app';
import { serverConfig } from '../config';

/**
 * Server startup logic.
 */
export class Server {
    private appInstance: App;

    constructor() {
        this.appInstance = new App();
    }

    /**
     * Starts the HTTP server.
     */
    public start(expressApp: any): void {
        this.appInstance.initialize(expressApp);

        const PORT = process.env.PORT || 3000;
        const host = serverConfig.host || '0.0.0.0';

        expressApp.listen(PORT, host, () => {
            console.log(`[Runtime] Zero Trust Server started on http://${host}:${PORT}`);
        });
    }
}
