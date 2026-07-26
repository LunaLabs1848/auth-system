import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import './config/db.js';
import { initDatabase } from './config/initDb.js';
import authRoutes from './routes/auth.routes.js'; // <-- Import your routes file
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());

// Mount Routes
app.use('/api/auth', authRoutes); // <-- All endpoints in authRoutes will now be prefixed with /api/auth

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong internally!' });
});

app.listen(PORT, async () => {
  await initDatabase();
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
