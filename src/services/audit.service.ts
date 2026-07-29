import pool from '../config/db.js';

export type AuditAction =
  'REGISTER' | 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'TOKEN_REFRESH' | 'LOGOUT';

interface LogEventParams {
  userId?: string | null;
  action: AuditAction;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export class AuditService {
  /**
   * Persists a security audit event asynchronously.
   * Fails gracefully without throwing errors so it never blocks HTTP execution.
   */
  static async logEvent({ userId, action, ipAddress, userAgent }: LogEventParams): Promise<void> {
    try {
      const query = `
        INSERT INTO audit_logs (user_id, action, ip_address, user_agent)
        VALUES ($1, $2, $3, $4);
      `;
      await pool.query(query, [userId || null, action, ipAddress || null, userAgent || null]);
    } catch (error) {
      // Log to server stdout, but don't rethrow (so user requests aren't interrupted)
      console.error('[AUDIT LOG ERROR] Failed to record audit event:', error);
    }
  }
}
