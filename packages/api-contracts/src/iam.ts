import { z } from 'zod';
import { UserRoleSchema, AccountStatusSchema } from './enums';

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(64),
  fullNameTh: z.string().min(1),
  fullNameEn: z.string().min(1),
  email: z.string().email(),
  secondaryEmail: z.string().email().nullable().optional(),
  phoneNumber: z.string().min(9).max(15).nullable().optional(),
  role: UserRoleSchema,
  facultyId: z.string().min(1),
  departmentName: z.string().nullable().optional(),
  accountStatus: AccountStatusSchema,
  lastSyncAt: z.date().or(z.string()),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const SsprRequestOtpInputSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  citizenIdLast4: z.string().length(4, 'Last 4 digits of Citizen ID required'),
  channel: z.enum(['SMS', 'EMAIL']).default('SMS'),
});
export type SsprRequestOtpInput = z.infer<typeof SsprRequestOtpInputSchema>;

export const SsprRequestOtpResponseSchema = z.object({
  success: z.boolean(),
  requestId: z.string().uuid(),
  maskedTarget: z.string(), // e.g. '089-***-1234' or 'j***@gmail.com'
  referenceCode: z.string().length(6),
  expiresAt: z.string(),
});
export type SsprRequestOtpResponse = z.infer<typeof SsprRequestOtpResponseSchema>;

export const SsprVerifyOtpInputSchema = z.object({
  requestId: z.string().uuid(),
  otpCode: z.string().length(6, 'OTP must be 6 digits'),
});
export type SsprVerifyOtpInput = z.infer<typeof SsprVerifyOtpInputSchema>;

export const SsprVerifyOtpResponseSchema = z.object({
  success: z.boolean(),
  resetToken: z.string().min(32),
  expiresInSeconds: z.number(),
});
export type SsprVerifyOtpResponse = z.infer<typeof SsprVerifyOtpResponseSchema>;

export const SsprExecuteResetInputSchema = z.object({
  resetToken: z.string().min(32),
  newPassword: z
    .string()
    .min(10, 'Password must be at least 10 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
export type SsprExecuteResetInput = z.infer<typeof SsprExecuteResetInputSchema>;

export const AccountDiagnosticResponseSchema = z.object({
  username: z.string(),
  fullName: z.string(),
  role: UserRoleSchema,
  status: AccountStatusSchema,
  isLocked: z.boolean(),
  lockoutReason: z.string().nullable(),
  suggestedAction: z.string(),
  hasMfaConfigured: z.boolean(),
  lastLoginAttemptAt: z.string().nullable().optional(),
});
export type AccountDiagnosticResponse = z.infer<typeof AccountDiagnosticResponseSchema>;
