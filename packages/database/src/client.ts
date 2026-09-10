import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as schema from './schema/mysql';

// Load .env from root if not already set
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const connectionString =
  process.env.DATABASE_URL || 'mysql://root:1234@localhost:3306/uni_it_hub';

// MySQL connection pool
export const poolConnection = mysql.createPool(connectionString);
export const db = drizzle(poolConnection, { schema, mode: 'default' });
export type DatabaseInstance = typeof db;
