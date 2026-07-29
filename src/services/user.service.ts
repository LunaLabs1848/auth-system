import pool from '../config/db.js';
import type { QueryResult } from 'pg';

// Define a strict interface representing the structure of our User row in PostgreSQL
export interface UserRow {
  id: string;
  email: string;
  password: string;
  refresh_token: string | null;
  created_at: Date;
}

export class UserService {
  /**
   * Look up a user in the database by their unique email address.
   */
  static async findUserByEmail(email: string): Promise<UserRow | null> {
    const query = 'SELECT * FROM users WHERE email = $1;';
    const result: QueryResult<UserRow> = await pool.query(query, [email.toLowerCase().trim()]);

    return result.rows[0] ?? null;
  }

  /**
   * Insert a brand new user into the database with a pre-hashed password.
   */
  static async createUser(email: string, passwordHash: string): Promise<UserRow | null> {
    const query = `
      INSERT INTO users (email, password) 
      VALUES ($1, $2) 
      RETURNING id, email, created_at;
    `;
    const values = [email.toLowerCase().trim(), passwordHash];
    const result: QueryResult<UserRow> = await pool.query(query, values);

    return result.rows[0] ?? null;
  }

  /**
   * Saves or updates a user's active refresh token in the database.
   */
  static async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    const query = 'UPDATE users SET refresh_token = $1 WHERE id = $2;';
    await pool.query(query, [refreshToken, userId]);
  }

  /**
   * Look up an active user profile by their matching refresh token.
   */
  static async findUserByRefreshToken(refreshToken: string): Promise<UserRow | null> {
    const query = 'SELECT * FROM users WHERE refresh_token = $1;';
    const result = await pool.query<UserRow>(query, [refreshToken]);

    return result.rows[0] || null;
  }
}
