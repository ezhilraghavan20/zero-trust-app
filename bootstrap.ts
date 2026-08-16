import express from 'express';
import { Server } from './modules/module-11-runtime/server';

/**
 * Bootstrap script to start the Zero Trust Development Server.
 */
const startServer = () => {
    const expressApp = express();

    // Express JSON and Urlencoded middleware are usually needed
    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: true }));

    const server = new Server();
    server.start(expressApp);
};

try {
    startServer();
} catch (error) {
    console.error('Failed to start Zero Trust Server:', error);
    process.exit(1);
}
