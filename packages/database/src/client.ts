import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema/mysql';

const connectionString =
  process.env.DATABASE_URL || 'mysql://root@localhost:3306/uni_it_hub';

// MySQL connection pool
export const poolConnection = mysql.createPool(connectionString);
export const db = drizzle(poolConnection, { schema, mode: 'default' });
export type DatabaseInstance = typeof db;
