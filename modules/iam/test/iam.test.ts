import { describe, it, expect, beforeEach } from 'vitest';
import { IamService } from '../src';

describe('IAM & SSPR Service Tests', () => {
  let iamService: IamService;

  beforeEach(() => {
    iamService = new IamService();
  });

  it('generates OTP with reference code and masked phone number', async () => {
    const res = await iamService.requestSsprOtp({
      username: 'u6510001',
      citizenIdLast4: '1234',
      channel: 'SMS',
    });

    expect(res.success).toBe(true);
    expect(res.maskedTarget).toBe('081-***-5678');
    expect(res.referenceCode).toHaveLength(6);
    expect(res.requestId).toBeDefined();
  });

  it('rejects SSPR request with invalid citizen ID', async () => {
    await expect(
      iamService.requestSsprOtp({
        username: 'u6510001',
        citizenIdLast4: '9999',
        channel: 'SMS',
      }),
    ).rejects.toThrow('Invalid verification details');
  });

  it('enforces rate limit of 3 requests per window', async () => {
    const payload = {
      username: 'u6510001',
      citizenIdLast4: '1234',
      channel: 'SMS' as const,
    };

    await iamService.requestSsprOtp(payload);
    await iamService.requestSsprOtp(payload);
    await iamService.requestSsprOtp(payload);

    await expect(iamService.requestSsprOtp(payload)).rejects.toThrow('Rate limit exceeded');
  });

  it('completes the full end-to-end SSPR lifecycle', async () => {
    // 1. Request OTP
    const reqRes = await iamService.requestSsprOtp({
      username: 'u6510001',
      citizenIdLast4: '1234',
      channel: 'SMS',
    });

    const plainOtp = iamService.getTestOtp(reqRes.requestId);
    expect(plainOtp).toBeDefined();

    // 2. Verify with wrong OTP
    await expect(
      iamService.verifySsprOtp({
        requestId: reqRes.requestId,
        otpCode: '000000',
      }),
    ).rejects.toThrow('Incorrect OTP code');

    // 3. Verify with correct OTP
    const verifyRes = await iamService.verifySsprOtp({
      requestId: reqRes.requestId,
      otpCode: plainOtp!,
    });
    expect(verifyRes.success).toBe(true);
    expect(verifyRes.resetToken).toBeDefined();

    // 4. Reset password
    const resetRes = await iamService.executePasswordReset({
      resetToken: verifyRes.resetToken,
      newPassword: 'StrongPass123!',
      confirmPassword: 'StrongPass123!',
    });
    expect(resetRes.success).toBe(true);
  });

  it('returns diagnostic info for a locked account', async () => {
    const diag = await iamService.getAccountDiagnostic('u6510002');
    expect(diag.isLocked).toBe(true);
    expect(diag.status).toBe('LOCKED_PASSWORD_ATTEMPTS');
    expect(diag.suggestedAction).toContain('Self-Service Password Reset');
  });
});
