import { mysqlTable, varchar, text, timestamp, boolean, int, mysqlEnum, json } from 'drizzle-orm/mysql-core';

export const serviceStateEnum = mysqlEnum('service_state', [
  'OPERATIONAL',
  'DEGRADED',
  'PARTIAL_OUTAGE',
  'MAJOR_OUTAGE',
]);

export const incidentImpactEnum = mysqlEnum('incident_impact', [
  'NONE',
  'MINOR',
  'MAJOR',
  'CRITICAL',
]);

export const services = mysqlTable('status_services', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 128 }).notNull(),
  description: varchar('description', { length: 255 }),
  category: varchar('category', { length: 64 }).notNull(),
  currentState: serviceStateEnum.default('OPERATIONAL').notNull(),
  displayOrder: int('display_order').default(0).notNull(),
  probeUrl: varchar('probe_url', { length: 512 }),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const incidents = mysqlTable('status_incidents', {
  id: varchar('id', { length: 36 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  impact: incidentImpactEnum.default('MINOR').notNull(),
  summary: text('summary').notNull(),
  affectedServiceIds: json('affected_service_ids').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type ServiceRecord = typeof services.$inferSelect;
export type NewServiceRecord = typeof services.$inferInsert;
export type IncidentRecord = typeof incidents.$inferSelect;
export type NewIncidentRecord = typeof incidents.$inferInsert;
