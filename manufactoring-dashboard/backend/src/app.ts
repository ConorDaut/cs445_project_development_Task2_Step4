import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from './config';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import partsRoutes from './routes/parts';
import ordersRoutes from './routes/orders';
import adminRoutes from './routes/admin';

const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: config.corsOrigin, credentials: true }));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/parts', partsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);

export default app;
