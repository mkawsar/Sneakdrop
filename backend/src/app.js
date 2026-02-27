import express from 'express';
import cors from 'cors';
import dropsRouter from './routes/drops.js';
import reservationsRouter from './routes/reservations.js';
import purchasesRouter from './routes/purchases.js';
import usersRouter from './routes/users.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.use('/api/drops', dropsRouter);
app.use('/api', reservationsRouter);
app.use('/api', purchasesRouter);
app.use('/api/users', usersRouter);

app.use(errorHandler);
export default app;
