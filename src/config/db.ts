import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Initialize a connection pool to handle multiple concurrent queries efficiently
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the database connection upon service boot
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack);
  } else {
    console.info('✅ Connected to PostgreSQL successfully at:', res.rows[0].now);
  }
});

export default pool;
