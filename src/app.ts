import 'reflect-metadata';
import cors from 'cors';
import express, { Application } from 'express';
import { RegisterRoutes } from './routes/routes';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './docs/swagger.json';
import './containers/dependencies';
import dotenv from 'dotenv';
import { corsConfig } from './config/cors';
import { notFoundErrorMiddleware } from './middlewares/notFoundError.middleware';
import { internalServerErrorMiddleware } from './middlewares/internalServerError.middleware';

dotenv.config();

const app: Application = express();

app.use(cors(corsConfig));

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/v1', (_req, res) => {
  res.send('Bem-vindo à API ISI Products Server');
});

const apiRouter = express.Router();

RegisterRoutes(apiRouter);
app.use('/api/v1', apiRouter);

app.use(notFoundErrorMiddleware);

app.use(internalServerErrorMiddleware);

export default app;