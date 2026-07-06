import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { CryptoService } from '../services/crypto.service.js';

export class AuthController {
  /**
   * Handles user creation and checks for profile conflicts.
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // 1. Basic Request Input Validation
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required fields.' });
        return;
      }

      if (password.length < 8) {
        res.status(400).json({ error: 'Password must be at least 8 characters long.' });
        return;
      }

      // 2. Check if user already exists
      const existingUser = await UserService.findUserByEmail(email);
      if (existingUser) {
        // We use 409 Conflict to signal resource duplication
        res.status(409).json({ error: 'A user account with that email already exists.' });
        return;
      }

      // 3. Hash the plain text password securely
      const hashedPassword = await CryptoService.hashPassword(password);

      // 4. Save the user records to PostgreSQL
      const newUser = await UserService.createUser(email, hashedPassword);
      if (!newUser) {
        res.status(500).json({ error: 'Failed to create user.' });
        return;
      }

      // 5. Respond with the safe user details (Never return the password hash!)
      res.status(201).json({
        message: 'User registered successfully!',
        user: {
          id: newUser.id,
          email: newUser.email,
          createdAt: newUser.created_at,
        },
      });
    } catch (error) {
      // Pass any unhandled structural errors down to our global Express error handler
      next(error);
    }
  }
}
