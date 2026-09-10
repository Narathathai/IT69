import { mysqlTable, varchar, text, timestamp, boolean, json, mysqlEnum } from 'drizzle-orm/mysql-core';
import { users } from './iam';

export const ticketPriorityEnum = mysqlEnum('ticket_priority', [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
]);

export const ticketTierEnum = mysqlEnum('ticket_tier', [
  'TIER_1_FACULTY',
  'TIER_2_CENTRAL_SUPPORT',
  'TIER_3_SPECIALIST',
]);

export const ticketStatusEnum = mysqlEnum('ticket_status', [
  'NEW',
  'ASSIGNED',
  'IN_PROGRESS',
  'PENDING_USER',
  'PENDING_VENDOR',
  'RESOLVED',
  'CLOSED',
]);

export const tickets = mysqlTable('itsm_tickets', {
  id: varchar('id', { length: 36 }).primaryKey(),
  ticketNumber: varchar('ticket_number', { length: 32 }).unique().notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  requesterId: varchar('requester_id', { length: 36 }).references(() => users.id).notNull(),
  assignedToId: varchar('assigned_to_id', { length: 36 }).references(() => users.id),
  facultyId: varchar('faculty_id', { length: 32 }).notNull(),
  category: varchar('category', { length: 64 }).notNull(),
  priority: ticketPriorityEnum.default('MEDIUM').notNull(),
  tier: ticketTierEnum.default('TIER_1_FACULTY').notNull(),
  status: ticketStatusEnum.default('NEW').notNull(),
  channel: varchar('channel', { length: 32 }).default('WEB').notNull(),
  slaTargetAt: timestamp('sla_target_at').notNull(),
  resolvedAt: timestamp('resolved_at'),
  suppressedByIncidentId: varchar('suppressed_by_incident_id', { length: 36 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const ticketComments = mysqlTable('itsm_ticket_comments', {
  id: varchar('id', { length: 36 }).primaryKey(),
  ticketId: varchar('ticket_id', { length: 36 }).references(() => tickets.id, { onDelete: 'cascade' }).notNull(),
  authorId: varchar('author_id', { length: 36 }).references(() => users.id).notNull(),
  content: text('content').notNull(),
  isInternalNote: boolean('is_internal_note').default(false).notNull(),
  attachments: json('attachments').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type TicketRecord = typeof tickets.$inferSelect;
export type NewTicketRecord = typeof tickets.$inferInsert;
export type TicketCommentRecord = typeof ticketComments.$inferSelect;
export type NewTicketCommentRecord = typeof ticketComments.$inferInsert;
