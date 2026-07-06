import pool from './db.js';

export const initDatabase = async (): Promise<void> => {
  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      refresh_token TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createUserTableQuery);
    console.info('📊 Database tables verified/initialized.');
  } catch (error) {
    console.error('❌ Error executing database initialization schema:', error);
    process.exit(1);
  }
};
