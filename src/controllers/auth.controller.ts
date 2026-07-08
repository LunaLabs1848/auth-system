import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { CryptoService } from '../services/crypto.service.js';
import { TokenService } from '../services/token.service.js';

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

  /**
   * Handles user login and token generation.
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
      }

      // 1. Fetch user from database
      const user = await UserService.findUserByEmail(email);
      if (!user) {
        // Use a generic message to prevent user enumeration attacks (security best practice)
        res.status(401).json({ error: 'Invalid email or password credentials.' });
        return;
      }

      // 2. Validate password hash
      const isPasswordValid = await CryptoService.comparePassword(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid email or password credentials.' });
        return;
      }

      // 3. Generate tokens
      const tokenPayload = { userId: user.id, email: user.email };
      const accessToken = TokenService.generateAccessToken(tokenPayload);
      const refreshToken = TokenService.generateRefreshToken(tokenPayload);

      // 4. Persistence: Save refresh token to database
      await UserService.updateRefreshToken(user.id, refreshToken);

      // 5. Append Refresh Token as a highly secure HttpOnly Cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // Blocks frontend JavaScript from reading the cookie
        secure: process.env.NODE_ENV === 'production', // Forces HTTPS in production
        sameSite: 'strict', // Prevents Cross-Site Request Forgery (CSRF) attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days matching refresh token lifespan
      });

      // 6. Send the short-lived access token in the JSON body
      res.status(200).json({
        message: 'Login successful!',
        accessToken,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
