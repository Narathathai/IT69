import './globals.css';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'UniIT Hub | University Enterprise IT Service Platform',
  description: 'Centralized IT Self-Service, IAM Password Reset, and Incident Status for University',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                IT
              </div>
              <div>
                <a href="/" className="font-bold text-slate-900 tracking-tight text-lg">
                  UniIT Hub
                </a>
                <p className="text-xs text-slate-500">ส่วนเทคโนโลยีสารสนเทศ มหาวิทยาลัย</p>
              </div>
            </div>
            <nav className="flex items-center space-x-5 text-xs sm:text-sm font-medium">
              <a href="/chat" className="text-slate-600 hover:text-purple-600 transition flex items-center space-x-1">
                <span>🤖</span>
                <span>AI ผู้ช่วย</span>
              </a>
              <a href="/sspr" className="text-slate-600 hover:text-blue-600 transition">
                รีเซ็ตรหัสผ่าน
              </a>
              <a href="/catalog" className="text-slate-600 hover:text-blue-600 transition">
                แคตตาล็อกบริการ
              </a>
              <a href="/tickets" className="text-slate-600 hover:text-blue-600 transition">
                แจ้งปัญหา
              </a>
              <a href="/status" className="text-slate-600 hover:text-emerald-600 transition flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span>สถานะระบบ</span>
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
          <p>© 2026 University Enterprise IT Service Platform (UniIT Hub). All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
