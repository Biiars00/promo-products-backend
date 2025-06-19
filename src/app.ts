import 'reflect-metadata';
import cors from 'cors';
import express, { Application } from 'express';
import dotenv from 'dotenv';
import { corsConfig } from './config/cors';

dotenv.config();

const app: Application = express();

app.use(cors(corsConfig));

app.use(express.json());

app.get('/', (_req, res) => {
    res.send('Bem-vindo à API ISI Products Server');
});

app.use((_req, res) => {
    res.status(404).send({ status: 'Not Found!' });
});

export default app;
