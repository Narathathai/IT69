import { mysqlTable, varchar, text, timestamp, json, mysqlEnum } from 'drizzle-orm/mysql-core';
import { users } from './iam';

export const catalogRequestStatusEnum = mysqlEnum('catalog_request_status', [
  'SUBMITTED',
  'PENDING_DEAN_APPROVAL',
  'PENDING_IT_REVIEW',
  'APPROVED',
  'PROVISIONED',
  'REJECTED',
  'CANCELLED',
]);

export const catalogRequests = mysqlTable('catalog_requests', {
  id: varchar('id', { length: 36 }).primaryKey(),
  requestType: varchar('request_type', { length: 64 }).notNull(),
  requesterId: varchar('requester_id', { length: 36 }).references(() => users.id).notNull(),
  status: catalogRequestStatusEnum.default('SUBMITTED').notNull(),
  formData: json('form_data').notNull(),
  justification: text('justification').notNull(),
  currentApproverId: varchar('current_approver_id', { length: 36 }).references(() => users.id),
  approvalToken: varchar('approval_token', { length: 128 }).unique(),
  tokenExpiresAt: timestamp('token_expires_at'),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export type CatalogRequestRecord = typeof catalogRequests.$inferSelect;
export type NewCatalogRequestRecord = typeof catalogRequests.$inferInsert;
