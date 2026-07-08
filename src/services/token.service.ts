import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: number;
  email: string;
}

export class TokenService {
  private static readonly ACCESS_SECRET = process.env.JWT_SECRET || 'fallback_access_secret';
  private static readonly REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';

  /**
   * Generates a short-lived (15 mins) Access Token containing non-sensitive user metadata.
   */
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.ACCESS_SECRET, { expiresIn: '15m' });
  }

  /**
   * Generates a long-lived (7 days) Refresh Token.
   */
  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.REFRESH_SECRET, { expiresIn: '7d' });
  }
}
