import { mysqlTable, varchar, text, timestamp, json } from 'drizzle-orm/mysql-core';

export const systemLogs = mysqlTable('audit_system_logs', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }),
  ipAddress: varchar('ip_address', { length: 64 }).notNull(),
  userAgent: text('user_agent'),
  actionType: varchar('action_type', { length: 64 }).notNull(),
  resourceType: varchar('resource_type', { length: 64 }).notNull(),
  resourceId: varchar('resource_id', { length: 64 }),
  payload: json('payload'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type SystemLogRecord = typeof systemLogs.$inferSelect;
export type NewSystemLogRecord = typeof systemLogs.$inferInsert;
