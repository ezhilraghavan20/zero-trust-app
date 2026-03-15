import express from 'express';
import { Server } from './server/server';

// Create Express application
const app = express();

// Start the runtime server
new Server().start(app);

// Export the app for potential testing
export default app;
