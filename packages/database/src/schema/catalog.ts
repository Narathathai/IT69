import { pgSchema, uuid, varchar, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { users } from './iam';

export const catalogSchema = pgSchema('catalog');

export const catalogRequestStatusEnum = catalogSchema.enum('catalog_request_status', [
  'SUBMITTED',
  'PENDING_DEAN_APPROVAL',
  'PENDING_IT_REVIEW',
  'APPROVED',
  'PROVISIONED',
  'REJECTED',
  'CANCELLED',
]);

export const catalogRequests = catalogSchema.table('catalog_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  requestType: varchar('request_type', { length: 64 }).notNull(),
  requesterId: uuid('requester_id').references(() => users.id).notNull(),
  status: catalogRequestStatusEnum('status').default('SUBMITTED').notNull(),
  formData: jsonb('form_data').notNull(),
  justification: text('justification').notNull(),
  currentApproverId: uuid('current_approver_id').references(() => users.id),
  approvalToken: varchar('approval_token', { length: 128 }).unique(),
  tokenExpiresAt: timestamp('token_expires_at', { withTimezone: true }),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type CatalogRequestRecord = typeof catalogRequests.$inferSelect;
export type NewCatalogRequestRecord = typeof catalogRequests.$inferInsert;
