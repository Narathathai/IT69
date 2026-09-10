import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const dbUrl = process.env.DATABASE_URL || 'mysql://root@localhost:3306/uni_it_hub';
const isMysql = dbUrl.startsWith('mysql');

export default defineConfig({
  schema: isMysql ? './src/schema/mysql/index.ts' : './src/schema/index.ts',
  out: isMysql ? './drizzle/mysql' : './drizzle/postgres',
  dialect: isMysql ? 'mysql' : 'postgresql',
  dbCredentials: {
    url: dbUrl,
  },
});
