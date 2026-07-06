import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // Balanced setting for production-grade security and CPU speed

export class CryptoService {
  /**
   * Hashes a plain text password with a secure salt.
   */
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Compares a plain text input password against an existing database hash.
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
