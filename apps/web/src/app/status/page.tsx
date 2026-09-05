'use client';

import React, { useState } from 'react';

interface ServiceStatus {
  id: string;
  name: string;
  category: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAJOR_OUTAGE';
  uptime: string;
}

export default function StatusPage() {
  const [services] = useState<ServiceStatus[]>([
    { id: '1', name: 'Campus Wi-Fi & eduroam', category: 'Network', status: 'OPERATIONAL', uptime: '99.98%' },
    { id: '2', name: 'Campus Virtual Private Network (VPN)', category: 'Network', status: 'OPERATIONAL', uptime: '99.95%' },
    { id: '3', name: 'Student Information System (REG)', category: 'Academic', status: 'OPERATIONAL', uptime: '99.90%' },
    { id: '4', name: 'Learning Management System (LMS)', category: 'Academic', status: 'OPERATIONAL', uptime: '99.99%' },
    { id: '5', name: 'University Microsoft 365 & Mail', category: 'Office Suite', status: 'OPERATIONAL', uptime: '100.0%' },
  ]);

  const allOperational = services.every((s) => s.status === 'OPERATIONAL');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* System Banner */}
      <div
        className={`p-6 rounded-3xl border flex items-center justify-between ${
          allOperational
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            : 'bg-rose-50/80 border-rose-200 text-rose-900'
        }`}
      >
        <div className="flex items-center space-x-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
              allOperational ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
            }`}
          >
            {allOperational ? '✓' : '⚠️'}
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {allOperational ? 'ทุกระบบเปิดให้บริการตามปกติ' : 'มีบางบริการกำลังประสบปัญหาขัดข้อง'}
            </h2>
            <p className="text-xs opacity-80 mt-0.5">
              อัปเดตล่าสุด: {new Date().toLocaleTimeString('th-TH')} • อัตโนมัติทุก 60 วินาที
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/80 shadow-sm border border-emerald-100">
          Uptime 30 วัน: 99.96%
        </span>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-slate-50 flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>บริการไอทีส่วนกลาง</span>
          <span>สถานะการทำงาน</span>
        </div>

        {services.map((svc) => (
          <div key={svc.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/60 transition">
            <div>
              <h4 className="font-semibold text-slate-900 text-base">{svc.name}</h4>
              <span className="text-xs text-slate-400 font-medium">{svc.category}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                พร้อมใช้งาน (Normal)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Outage Notice Section */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center">
        <h4 className="font-bold text-slate-900 text-sm">พบปัญหาบริการขัดข้องที่ไม่ได้ระบุในหน้านี้?</h4>
        <p className="text-xs text-slate-500 mt-1">
          ติดต่อศูนย์บริการไอทีกลาง หรือแจ้งผ่าน LINE Official Account เพื่อรับการช่วยเหลือทันที
        </p>
        <div className="mt-4 flex justify-center space-x-3">
          <a
            href="https://line.me"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition"
          >
            แจ้งผ่าน LINE OA
          </a>
          <a
            href="/"
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
          >
            ส่งคำร้องผ่านเว็บไซต์
          </a>
        </div>
      </div>
    </div>
  );
}
