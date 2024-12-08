import express from 'express';
import path from 'path';
import { urlRoutes } from './routes/urlRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

// Routes
app.use('/', urlRoutes);

// Error handling
app.use(errorHandler);

export { app };