import { describe, it, expect } from 'vitest';
import {
  SsprRequestOtpInputSchema,
  SsprExecuteResetInputSchema,
  CreateTicketInputSchema,
} from '../src';

describe('API Contracts Validation', () => {
  it('validates SSPR OTP input correctly', () => {
    const valid = SsprRequestOtpInputSchema.safeParse({
      username: 'u65123456',
      citizenIdLast4: '1234',
      channel: 'SMS',
    });
    expect(valid.success).toBe(true);

    const invalid = SsprRequestOtpInputSchema.safeParse({
      username: 'u',
      citizenIdLast4: '12',
    });
    expect(invalid.success).toBe(false);
  });

  it('validates password complexity and confirmation match', () => {
    const valid = SsprExecuteResetInputSchema.safeParse({
      resetToken: 'a'.repeat(32),
      newPassword: 'StrongPassword123!',
      confirmPassword: 'StrongPassword123!',
    });
    expect(valid.success).toBe(true);

    const mismatch = SsprExecuteResetInputSchema.safeParse({
      resetToken: 'a'.repeat(32),
      newPassword: 'StrongPassword123!',
      confirmPassword: 'DifferentPassword123!',
    });
    expect(mismatch.success).toBe(false);

    const weak = SsprExecuteResetInputSchema.safeParse({
      resetToken: 'a'.repeat(32),
      newPassword: 'weak',
      confirmPassword: 'weak',
    });
    expect(weak.success).toBe(false);
  });

  it('validates ticket creation schema', () => {
    const valid = CreateTicketInputSchema.safeParse({
      title: 'Cannot connect to eduroam WiFi',
      description: 'Getting authentication error when connecting from Engineering building 3.',
      facultyId: 'ENG',
      category: 'WIFI',
      priority: 'HIGH',
    });
    expect(valid.success).toBe(true);
  });
});
