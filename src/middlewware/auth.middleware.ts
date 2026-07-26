import type { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/token.service.js';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // 1. Extract the Authorization header (Expected format: "Bearer <token>")
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Access denied. No valid bearer token provided.' });
      return;
    }

    // 2. Separate "Bearer" from the token string
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Authentication token is missing.' });
      return;
    }

    // 3. Verify signature and expiration
    const decoded = TokenService.verifyAccessToken(token);

    // 4. Attach decoded token user payload to Express request object
    req.user = decoded;

    // 5. Pass control to the next handler in the execution chain
    next();
  } catch {
    // If jwt.verify throws an error (e.g. TokenExpiredError or JsonWebTokenError)
    res.status(401).json({ error: 'Invalid or expired access token.' });
  }
};
