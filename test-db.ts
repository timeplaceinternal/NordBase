import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config();

async function test() {
  try {
    console.log('Testing connection to:', process.env.POSTGRES_URL ? 'URL is set' : 'URL is NOT set');
    const result = await sql`SELECT 1 as connected`;
    console.log('Result:', result.rows);
    console.log('DATABASE_STATUS: OK');
  } catch (error: any) {
    console.error('DATABASE_STATUS: ERROR');
    console.error('Error message:', error.message);
  }
}

test();
