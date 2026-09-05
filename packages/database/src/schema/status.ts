import { pgSchema, uuid, varchar, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const statusSchema = pgSchema('status');

export const serviceStateEnum = statusSchema.enum('service_state', [
  'OPERATIONAL',
  'DEGRADED',
  'PARTIAL_OUTAGE',
  'MAJOR_OUTAGE',
]);

export const incidentImpactEnum = statusSchema.enum('incident_impact', [
  'NONE',
  'MINOR',
  'MAJOR',
  'CRITICAL',
]);

export const services = statusSchema.table('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 128 }).notNull(),
  description: varchar('description', { length: 255 }),
  category: varchar('category', { length: 64 }).notNull(),
  currentState: serviceStateEnum('current_state').default('OPERATIONAL').notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  probeUrl: varchar('probe_url', { length: 512 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const incidents = statusSchema.table('incidents', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  impact: incidentImpactEnum('impact').default('MINOR').notNull(),
  summary: text('summary').notNull(),
  affectedServiceIds: uuid('affected_service_ids').array().notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type ServiceRecord = typeof services.$inferSelect;
export type NewServiceRecord = typeof services.$inferInsert;
export type IncidentRecord = typeof incidents.$inferSelect;
export type NewIncidentRecord = typeof incidents.$inferInsert;
