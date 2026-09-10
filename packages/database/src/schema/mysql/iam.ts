import { mysqlTable, varchar, timestamp, boolean, smallint, mysqlEnum } from 'drizzle-orm/mysql-core';

export const userRoleEnum = mysqlEnum('user_role', [
  'STUDENT',
  'FACULTY_STAFF',
  'FACULTY_IT_L1',
  'CENTRAL_IT_L2_L3',
  'SUPER_ADMIN',
]);

export const accountStatusEnum = mysqlEnum('account_status', [
  'ACTIVE',
  'LOCKED_PASSWORD_ATTEMPTS',
  'SUSPENDED_STATUS_CHANGE',
  'EXPIRED',
]);

export const users = mysqlTable('iam_users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  username: varchar('username', { length: 64 }).unique().notNull(),
  citizenIdHash: varchar('citizen_id_hash', { length: 64 }).notNull(),
  fullNameTh: varchar('full_name_th', { length: 255 }).notNull(),
  fullNameEn: varchar('full_name_en', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  secondaryEmail: varchar('secondary_email', { length: 255 }),
  phoneNumber: varchar('phone_number', { length: 32 }),
  role: userRoleEnum.default('STUDENT').notNull(),
  facultyId: varchar('faculty_id', { length: 32 }).notNull(),
  departmentName: varchar('department_name', { length: 128 }),
  accountStatus: accountStatusEnum.default('ACTIVE').notNull(),
  lastSyncAt: timestamp('last_sync_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const otpRequests = mysqlTable('iam_otp_requests', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).references(() => users.id).notNull(),
  otpCodeHash: varchar('otp_code_hash', { length: 64 }).notNull(),
  channel: varchar('channel', { length: 16 }).notNull(),
  recipient: varchar('recipient', { length: 255 }).notNull(),
  referenceCode: varchar('reference_code', { length: 10 }).notNull(),
  attemptsLeft: smallint('attempts_left').default(3).notNull(),
  isUsed: boolean('is_used').default(false).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type UserRecord = typeof users.$inferSelect;
export type NewUserRecord = typeof users.$inferInsert;
export type OtpRequestRecord = typeof otpRequests.$inferSelect;
export type NewOtpRequestRecord = typeof otpRequests.$inferInsert;
