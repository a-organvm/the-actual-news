import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.POSTGRES_URI || 'postgres://news:news@localhost:5432/news_ledger',
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
