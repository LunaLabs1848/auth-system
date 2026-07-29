import pool from './db.js';

export const initDatabase = async (): Promise<void> => {
  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      refresh_token TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createAuditLogsTable = `
  CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

  try {
    await pool.query(createUserTableQuery);
    await pool.query(createAuditLogsTable);
    console.info('📊 Database tables verified/initialized.');
  } catch (error) {
    console.error('❌ Error executing database initialization schema:', error);
    process.exit(1);
  }
};
