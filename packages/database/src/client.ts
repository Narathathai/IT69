import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://uni_admin:uni_secret_pass@localhost:5432/uni_it_hub';

// For migrations & queries
export const queryClient = postgres(connectionString, { max: 10 });
export const db = drizzle(queryClient, { schema });
export type DatabaseInstance = typeof db;
