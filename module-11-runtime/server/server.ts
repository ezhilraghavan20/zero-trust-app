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

        expressApp.listen(serverConfig.port, serverConfig.host, () => {
            console.log(`[Runtime] Zero Trust Server started on http://${serverConfig.host}:${serverConfig.port}`);
        });
    }
}
