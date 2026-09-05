import { pgTable, pgSchema, uuid, varchar, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { users } from './iam';

export const itsmSchema = pgSchema('itsm');

export const ticketPriorityEnum = itsmSchema.enum('ticket_priority', [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
]);

export const ticketTierEnum = itsmSchema.enum('ticket_tier', [
  'TIER_1_FACULTY',
  'TIER_2_CENTRAL_SUPPORT',
  'TIER_3_SPECIALIST',
]);

export const ticketStatusEnum = itsmSchema.enum('ticket_status', [
  'NEW',
  'ASSIGNED',
  'IN_PROGRESS',
  'PENDING_USER',
  'PENDING_VENDOR',
  'RESOLVED',
  'CLOSED',
]);

export const tickets = itsmSchema.table('tickets', {
  id: uuid('id').defaultRandom().primaryKey(),
  ticketNumber: varchar('ticket_number', { length: 32 }).unique().notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  requesterId: uuid('requester_id').references(() => users.id).notNull(),
  assignedToId: uuid('assigned_to_id').references(() => users.id),
  facultyId: varchar('faculty_id', { length: 32 }).notNull(),
  category: varchar('category', { length: 64 }).notNull(),
  priority: ticketPriorityEnum('priority').default('MEDIUM').notNull(),
  tier: ticketTierEnum('tier').default('TIER_1_FACULTY').notNull(),
  status: ticketStatusEnum('status').default('NEW').notNull(),
  channel: varchar('channel', { length: 32 }).default('WEB').notNull(),
  slaTargetAt: timestamp('sla_target_at', { withTimezone: true }).notNull(),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  suppressedByIncidentId: uuid('suppressed_by_incident_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const ticketComments = itsmSchema.table('ticket_comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  ticketId: uuid('ticket_id').references(() => tickets.id, { onDelete: 'cascade' }).notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  isInternalNote: boolean('is_internal_note').default(false).notNull(),
  attachments: jsonb('attachments').default([]).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type TicketRecord = typeof tickets.$inferSelect;
export type NewTicketRecord = typeof tickets.$inferInsert;
export type TicketCommentRecord = typeof ticketComments.$inferSelect;
export type NewTicketCommentRecord = typeof ticketComments.$inferInsert;
