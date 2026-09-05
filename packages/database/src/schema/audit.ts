import { pgSchema, uuid, varchar, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const auditSchema = pgSchema('audit');

export const systemLogs = auditSchema.table('system_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id'),
  ipAddress: varchar('ip_address', { length: 64 }).notNull(),
  userAgent: text('user_agent'),
  actionType: varchar('action_type', { length: 64 }).notNull(),
  resourceType: varchar('resource_type', { length: 64 }).notNull(),
  resourceId: varchar('resource_id', { length: 64 }),
  payload: jsonb('payload'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type SystemLogRecord = typeof systemLogs.$inferSelect;
export type NewSystemLogRecord = typeof systemLogs.$inferInsert;
