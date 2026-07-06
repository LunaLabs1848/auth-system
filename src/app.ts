import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import './config/db.js';
import { initDatabase } from './config/initDb.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: true, // We will update this later once the frontend is integrated
    credentials: true, // Crucial for handling cookies later!
  })
);

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Global Error Handler Middleware
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong internally!' });
});

app.listen(PORT, () => {
  console.info(`🚀 Server is running on http://localhost:${PORT}`);
});

app.listen(PORT, async () => {
  await initDatabase();
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
