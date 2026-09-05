import crypto from 'node:crypto';
import {
  SsprRequestOtpInput,
  SsprRequestOtpResponse,
  SsprVerifyOtpInput,
  SsprVerifyOtpResponse,
  SsprExecuteResetInput,
  AccountDiagnosticResponse,
} from '@uni-it/api-contracts';
import { UniversityDirectoryAdapter } from './mock-adapter';

export interface ActiveOtpSession {
  requestId: string;
  username: string;
  otpHash: string;
  plainOtpForTesting: string;
  referenceCode: string;
  recipient: string;
  attemptsLeft: number;
  isUsed: boolean;
  expiresAt: Date;
}

export interface ActiveResetToken {
  token: string;
  username: string;
  expiresAt: Date;
}

export class IamService {
  private directory: UniversityDirectoryAdapter;
  private otpSessions = new Map<string, ActiveOtpSession>();
  private resetTokens = new Map<string, ActiveResetToken>();
  private requestCountsPerUser = new Map<string, { count: number; windowStart: number }>();

  constructor(directory = new UniversityDirectoryAdapter()) {
    this.directory = directory;
  }

  private hash(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  private maskPhone(phone: string): string {
    if (phone.length < 8) return '***';
    return `${phone.slice(0, 3)}-***-${phone.slice(-4)}`;
  }

  async requestSsprOtp(input: SsprRequestOtpInput): Promise<SsprRequestOtpResponse> {
    const user = await this.directory.findUserByUsername(input.username);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.citizenIdLast4 !== input.citizenIdLast4) {
      throw new Error('Invalid verification details');
    }

    // Rate limiting: Max 3 requests per 15 minutes
    const now = Date.now();
    const rateWindow = 15 * 60 * 1000;
    const currentRate = this.requestCountsPerUser.get(input.username) || {
      count: 0,
      windowStart: now,
    };

    if (now - currentRate.windowStart > rateWindow) {
      currentRate.count = 1;
      currentRate.windowStart = now;
    } else {
      if (currentRate.count >= 3) {
        throw new Error('Rate limit exceeded. Please try again in 15 minutes.');
      }
      currentRate.count++;
    }
    this.requestCountsPerUser.set(input.username, currentRate);

    // Generate 6-digit OTP & 6-char Reference Code
    const plainOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const referenceCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    const requestId = crypto.randomUUID();
    const expiresAt = new Date(now + 5 * 60 * 1000); // 5 mins

    this.otpSessions.set(requestId, {
      requestId,
      username: input.username,
      otpHash: this.hash(plainOtp),
      plainOtpForTesting: plainOtp,
      referenceCode,
      recipient: user.phoneNumber,
      attemptsLeft: 3,
      isUsed: false,
      expiresAt,
    });

    return {
      success: true,
      requestId,
      maskedTarget: this.maskPhone(user.phoneNumber),
      referenceCode,
      expiresAt: expiresAt.toISOString(),
    };
  }

  async verifySsprOtp(input: SsprVerifyOtpInput): Promise<SsprVerifyOtpResponse> {
    const session = this.otpSessions.get(input.requestId);
    if (!session) {
      throw new Error('Invalid or expired OTP session');
    }

    if (session.isUsed) {
      throw new Error('OTP has already been used');
    }

    if (Date.now() > session.expiresAt.getTime()) {
      throw new Error('OTP has expired');
    }

    if (session.attemptsLeft <= 0) {
      throw new Error('Maximum verification attempts exceeded');
    }

    const inputHash = this.hash(input.otpCode);
    if (inputHash !== session.otpHash) {
      session.attemptsLeft--;
      throw new Error(`Incorrect OTP code. ${session.attemptsLeft} attempts remaining.`);
    }

    session.isUsed = true;

    // Issue a single-use Password Reset Token valid for 10 minutes
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetTokens.set(resetToken, {
      token: resetToken,
      username: session.username,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    return {
      success: true,
      resetToken,
      expiresInSeconds: 600,
    };
  }

  async executePasswordReset(input: SsprExecuteResetInput): Promise<{ success: boolean; message: string }> {
    const tokenRecord = this.resetTokens.get(input.resetToken);
    if (!tokenRecord) {
      throw new Error('Invalid or expired password reset token');
    }

    if (Date.now() > tokenRecord.expiresAt.getTime()) {
      this.resetTokens.delete(input.resetToken);
      throw new Error('Reset token has expired');
    }

    // Sync to directory
    const newPasswordHash = this.hash(input.newPassword);
    const syncSuccess = await this.directory.syncPasswordToLdap(tokenRecord.username, newPasswordHash);
    if (!syncSuccess) {
      throw new Error('Failed to synchronize new password with university directory');
    }

    // Invalidate token
    this.resetTokens.delete(input.resetToken);

    return {
      success: true,
      message: 'Password successfully updated and account unlocked.',
    };
  }

  async getAccountDiagnostic(username: string): Promise<AccountDiagnosticResponse> {
    const user = await this.directory.findUserByUsername(username);
    if (!user) {
      throw new Error(`Account not found for username: ${username}`);
    }

    const isLocked = user.isLocked;
    return {
      username: user.username,
      fullName: user.fullNameTh,
      role: 'STUDENT',
      status: isLocked ? 'LOCKED_PASSWORD_ATTEMPTS' : 'ACTIVE',
      isLocked,
      lockoutReason: isLocked ? 'Multiple incorrect password attempts detected.' : null,
      suggestedAction: isLocked
        ? 'Please use Self-Service Password Reset (SSPR) with your registered phone number.'
        : 'Your account is active and normal.',
      hasMfaConfigured: true,
      lastLoginAttemptAt: new Date().toISOString(),
    };
  }

  // Helper for automated testing
  getTestOtp(requestId: string): string | undefined {
    return this.otpSessions.get(requestId)?.plainOtpForTesting;
  }
}
