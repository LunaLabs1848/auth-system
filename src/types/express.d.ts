import type { TokenPayload } from '../services/token.service.js';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload; // Augments the built-in Express Request interface
    }
  }
}
