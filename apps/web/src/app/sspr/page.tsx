'use client';

import React, { useState } from 'react';

export default function SsprPage() {
  const [step, setStep] = useState<'IDENTIFY' | 'OTP' | 'PASSWORD' | 'SUCCESS'>('IDENTIFY');
  const [username, setUsername] = useState('u6510001');
  const [citizenIdLast4, setCitizenIdLast4] = useState('1234');
  const [channel, setChannel] = useState<'SMS' | 'EMAIL'>('SMS');

  // OTP State
  const [requestId, setRequestId] = useState('');
  const [refCode, setRefCode] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [resetToken, setResetToken] = useState('');

  // Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (username === 'u6510001' && citizenIdLast4 === '1234') {
        setRequestId('mock-req-id-123');
        setRefCode('AB88XY');
        setMaskedPhone('081-***-5678');
        setStep('OTP');
      } else {
        setError('ไม่พบข้อมูลผู้ใช้ หรือเลขท้ายบัตรประชาชนไม่ถูกต้อง');
      }
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (otpCode.length === 6) {
        setResetToken('mock-reset-token-' + Date.now());
        setStep('PASSWORD');
      } else {
        setError('กรุณากรอกรหัส OTP 6 หลักให้ถูกต้อง');
      }
    }, 600);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    if (newPassword.length < 10) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 10 ตัวอักษร');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('SUCCESS');
    }, 700);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-2xl mb-3">
            🔐
          </div>
          <h2 className="text-2xl font-bold text-slate-900">รีเซ็ตรหัสผ่านด้วยตนเอง (SSPR)</h2>
          <p className="text-sm text-slate-500 mt-1">
            ระบบบริการเปลี่ยนรหัสผ่านและปลดล็อกบัญชีอัตโนมัติ 24 ชั่วโมง
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-8 px-4 text-xs font-semibold text-slate-400">
          <span className={step === 'IDENTIFY' ? 'text-blue-600 font-bold' : ''}>1. ยืนยันตัวตน</span>
          <span>→</span>
          <span className={step === 'OTP' ? 'text-blue-600 font-bold' : ''}>2. ตรวจสอบ OTP</span>
          <span>→</span>
          <span className={step === 'PASSWORD' ? 'text-blue-600 font-bold' : ''}>3. ตั้งรหัสใหม่</span>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Step 1: Identify */}
        {step === 'IDENTIFY' && (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                รหัสนักศึกษา หรือ รหัสบุคลากร
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                placeholder="เช่น u6510001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                เลขบัตรประชาชน 4 หลักสุดท้าย
              </label>
              <input
                type="password"
                maxLength={4}
                value={citizenIdLast4}
                onChange={(e) => setCitizenIdLast4(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                placeholder="****"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? 'กำลังตรวจสอบ...' : 'ขอรับรหัส OTP'}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="p-4 rounded-xl bg-blue-50 text-blue-800 text-xs leading-relaxed">
              รหัส OTP ถูกส่งไปยังเบอร์ <strong>{maskedPhone}</strong> แล้ว <br />
              รหัสอ้างอิง (Ref Code): <strong className="font-mono text-sm">{refCode}</strong>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                กรอกรหัส OTP (6 หลัก)
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center font-mono text-2xl tracking-widest text-slate-900"
                placeholder="000000"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? 'กำลังยืนยัน...' : 'ยืนยันรหัส OTP'}
            </button>
          </form>
        )}

        {/* Step 3: Password */}
        {step === 'PASSWORD' && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                รหัสผ่านใหม่ (อย่างน้อย 10 ตัวอักษร)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                placeholder="••••••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                ยืนยันรหัสผ่านใหม่อีกครั้ง
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่'}
            </button>
          </form>
        )}

        {/* Step 4: Success */}
        {step === 'SUCCESS' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <h3 className="text-xl font-bold text-slate-900">เปลี่ยนรหัสผ่านสำเร็จ!</h3>
            <p className="text-sm text-slate-600">
              รหัสผ่านใหม่ได้รับการซิงค์เข้าสู่ระบบกลางแล้ว คุณสามารถเข้าสู่ระบบ Wi-Fi, VPN และอีเมลได้ทันที
            </p>
            <div className="pt-4">
              <a
                href="/"
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition"
              >
                กลับสู่หน้าหลัก
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
