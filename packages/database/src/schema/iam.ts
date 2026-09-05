import { pgTable, pgSchema, uuid, varchar, text, timestamp, boolean, smallint } from 'drizzle-orm/pg-core';

export const iamSchema = pgSchema('iam');

export const userRoleEnum = iamSchema.enum('user_role', [
  'STUDENT',
  'FACULTY_STAFF',
  'FACULTY_IT_L1',
  'CENTRAL_IT_L2_L3',
  'SUPER_ADMIN',
]);

export const accountStatusEnum = iamSchema.enum('account_status', [
  'ACTIVE',
  'LOCKED_PASSWORD_ATTEMPTS',
  'SUSPENDED_STATUS_CHANGE',
  'EXPIRED',
]);

export const users = iamSchema.table('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 64 }).unique().notNull(),
  citizenIdHash: varchar('citizen_id_hash', { length: 64 }).notNull(),
  fullNameTh: varchar('full_name_th', { length: 255 }).notNull(),
  fullNameEn: varchar('full_name_en', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  secondaryEmail: varchar('secondary_email', { length: 255 }),
  phoneNumber: varchar('phone_number', { length: 32 }),
  role: userRoleEnum('role').default('STUDENT').notNull(),
  facultyId: varchar('faculty_id', { length: 32 }).notNull(),
  departmentName: varchar('department_name', { length: 128 }),
  accountStatus: accountStatusEnum('account_status').default('ACTIVE').notNull(),
  lastSyncAt: timestamp('last_sync_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const otpRequests = iamSchema.table('otp_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  otpCodeHash: varchar('otp_code_hash', { length: 64 }).notNull(),
  channel: varchar('channel', { length: 16 }).notNull(),
  recipient: varchar('recipient', { length: 255 }).notNull(),
  referenceCode: varchar('reference_code', { length: 10 }).notNull(),
  attemptsLeft: smallint('attempts_left').default(3).notNull(),
  isUsed: boolean('is_used').default(false).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type UserRecord = typeof users.$inferSelect;
export type NewUserRecord = typeof users.$inferInsert;
export type OtpRequestRecord = typeof otpRequests.$inferSelect;
export type NewOtpRequestRecord = typeof otpRequests.$inferInsert;
