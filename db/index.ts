import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export const isDbAvailable = typeof process !== 'undefined' && !!process.env.DATABASE_URL;

let dbInstance: any = null;

if (isDbAvailable) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    dbInstance = drizzle({ client: sql, schema });
  } catch (error) {
    console.error('Failed to initialize database client:', error);
  }
} else {
  if (typeof window === 'undefined') {
    console.warn('DATABASE_URL is missing. App is running in Demo/Cookie-offline mode.');
  }
}

export const db = dbInstance;

