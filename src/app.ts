import express from 'express';
import path from 'path';
import { urlRoutes } from './routes/urlRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

app.use('/', urlRoutes);

app.use(errorHandler);

export { app };