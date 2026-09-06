'use client';

import React, { useState } from 'react';

interface MockTicket {
  id: string;
  ticketNumber: string;
  title: string;
  category: string;
  facultyId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
  tier: 'TIER_1_FACULTY' | 'TIER_2_CENTRAL_SUPPORT';
  createdAt: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<MockTicket[]>([
    {
      id: '1',
      ticketNumber: 'T-2026-00102',
      title: 'ขอสิทธิ์เปิดพอร์ต VLAN พิเศษสำหรับห้อง Lab 504',
      category: 'VPN',
      facultyId: 'ENG',
      priority: 'HIGH',
      status: 'ASSIGNED',
      tier: 'TIER_2_CENTRAL_SUPPORT',
      createdAt: 'วันนี้ 10:30 น.',
    },
    {
      id: '2',
      ticketNumber: 'T-2026-00101',
      title: 'โปรเจกเตอร์ห้องบรรยาย 302 ภาพกระพริบ',
      category: 'CLASSROOM',
      facultyId: 'SCI',
      priority: 'CRITICAL',
      status: 'RESOLVED',
      tier: 'TIER_1_FACULTY',
      createdAt: 'วันนี้ 09:15 น.',
    },
  ]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'WIFI' | 'VPN' | 'EMAIL' | 'HARDWARE' | 'SOFTWARE' | 'CLASSROOM'>('WIFI');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [facultyId, setFacultyId] = useState('ENG');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNum = `T-2026-00${Math.floor(103 + tickets.length)}`;
    const newTicket: MockTicket = {
      id: Date.now().toString(),
      ticketNumber: newNum,
      title,
      category,
      facultyId,
      priority,
      status: 'NEW',
      tier: 'TIER_1_FACULTY',
      createdAt: 'เมื่อสักครู่',
    };

    setTickets([newTicket, ...tickets]);
    setSubmittedMessage(`สร้าง Ticket เลขที่ "${newNum}" สำเร็จแล้ว!`);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          ศูนย์แจ้งและติดตามคำร้องไอที (ITSM Helpdesk)
        </h2>
        <p className="mt-2 text-slate-600 text-sm">
          แจ้งปัญหาขัดข้องทางเทคโนโลยี ส่งเรื่องให้ช่างไอทีประจำคณะ หรือส่งต่อไปยังวิศวกรส่วนกลาง
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">เปิดคำร้องใหม่ (Open Ticket)</h3>

          {submittedMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
              ✓ {submittedMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">หัวข้อปัญหา</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น ไม่สามารถเชื่อมต่อ Wi-Fi ในห้องสมุดได้"
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">หมวดหมู่</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              >
                <option value="WIFI">Wi-Fi & Network</option>
                <option value="VPN">Campus VPN</option>
                <option value="CLASSROOM">ห้องเรียน / Smart Classroom</option>
                <option value="SOFTWARE">ซอฟต์แวร์ / ลิขสิทธิ์</option>
                <option value="HARDWARE">อุปกรณ์ / คอมพิวเตอร์</option>
                <option value="EMAIL">อีเมล / บัญชีผู้ใช้</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ความเร่งด่วน</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as typeof priority)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              >
                <option value="LOW">ต่ำ (SLA 24 ชม.)</option>
                <option value="MEDIUM">ปกติ (SLA 8 ชม.)</option>
                <option value="HIGH">สูง (SLA 4 ชม.)</option>
                <option value="CRITICAL">ฉุกเฉินมาก (SLA 2 ชม.)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">สังกัดคณะ / หน่วยงาน</label>
            <select
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
            >
              <option value="ENG">คณะวิศวกรรมศาสตร์</option>
              <option value="SCI">คณะวิทยาศาสตร์</option>
              <option value="MED">คณะแพทยศาสตร์</option>
              <option value="ARTS">คณะอักษรศาสตร์</option>
              <option value="CENTRAL">สำนักคอมพิวเตอร์ (ส่วนกลาง)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">รายละเอียดปัญหา</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุสถานที่ เกิดขึ้นตั้งแต่เมื่อใด และข้อความ error ที่พบ..."
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition shadow-sm"
          >
            ส่งคำร้องแจ้งปัญหา
          </button>
        </form>

        {/* Recent Tickets */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">รายการคำร้องล่าสุดของคุณ</h3>

          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {t.ticketNumber}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      t.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.status === 'RESOLVED' ? 'แก้ไขเสร็จสิ้น' : 'กำลังดำเนินการ'}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-900 text-sm leading-snug">{t.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-50">
                  <span>
                    ระดับ: <strong className="text-slate-600">{t.tier === 'TIER_1_FACULTY' ? 'ไอทีคณะ (L1)' : 'ไอทีกลาง (L2)'}</strong>
                  </span>
                  <span>{t.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
