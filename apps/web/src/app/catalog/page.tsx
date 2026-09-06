'use client';

import React, { useState } from 'react';

export default function CatalogPage() {
  const [requestType, setRequestType] = useState<'FIREWALL_RULE' | 'DNS_RECORD' | 'VM_INSTANCE' | 'SOFTWARE_LICENSE'>('FIREWALL_RULE');
  const [justification, setJustification] = useState('');
  const [approverEmail, setApproverEmail] = useState('dean@eng.university.ac.th');

  // Dynamic Fields
  const [sourceIp, setSourceIp] = useState('10.20.30.0/24');
  const [destIp, setDestIp] = useState('192.168.1.50');
  const [port, setPort] = useState('443');

  const [subdomain, setSubdomain] = useState('lab.eng.university.ac.th');
  const [targetIp, setTargetIp] = useState('203.144.12.34');

  const [submittedLink, setSubmittedLink] = useState<string | null>(null);
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const mockToken = 'tok_' + Math.random().toString(36).substring(2, 15);
      const link = `https://portal.university.ac.th/catalog/approve?token=${mockToken}`;
      setSubmittedLink(link);
      setSubmittedStatus('PENDING_DEAN_APPROVAL');
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Digital IT Service Catalog & E-Approval
        </h2>
        <p className="mt-2 text-slate-600 text-sm">
          ยื่นคำร้องขอใช้งานโครงสร้างพื้นฐานไอที ทรัพยากรคลาวด์ และซอฟต์แวร์วิชาการ พร้อมระบบอนุมัติดิจิทัล 1-Click
        </p>
      </div>

      {submittedLink ? (
        <div className="p-8 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-4 text-center">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
            ✓
          </div>
          <h3 className="text-xl font-bold text-slate-900">ยื่นคำร้องสำเร็จ!</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            ระบบได้สร้างใบคำร้องสถานะ <strong>"{submittedStatus}"</strong> และส่งอีเมลพร้อม Magic Link สำหรับกดอนุมัติไปยัง <strong>{approverEmail}</strong> เรียบร้อยแล้ว
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl text-left text-xs font-mono break-all border border-slate-200">
            <span className="text-slate-400 font-bold block mb-1">Secure Magic Link Preview:</span>
            {submittedLink}
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setSubmittedLink(null);
                setJustification('');
              }}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
            >
              ยื่นคำร้องรายการใหม่
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {/* Request Type Selector */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">ประเภทคำขอรับบริการ</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'FIREWALL_RULE', label: '🛡️ เปิด Port Firewall' },
                { id: 'DNS_RECORD', label: '🌐 ขอ Subdomain' },
                { id: 'VM_INSTANCE', label: '💻 ขอ Virtual Machine' },
                { id: 'SOFTWARE_LICENSE', label: '📦 ซอฟต์แวร์วิชาการ' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setRequestType(item.id as typeof requestType)}
                  className={`p-3 text-xs font-semibold rounded-xl border text-center transition ${
                    requestType === item.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Inputs */}
          {requestType === 'FIREWALL_RULE' && (
            <div className="grid sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Source IP / Subnet</label>
                <input
                  type="text"
                  value={sourceIp}
                  onChange={(e) => setSourceIp(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Destination IP</label>
                <input
                  type="text"
                  value={destIp}
                  onChange={(e) => setDestIp(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Port & Protocol</label>
                <input
                  type="text"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                  required
                />
              </div>
            </div>
          )}

          {requestType === 'DNS_RECORD' && (
            <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ชื่อ Subdomain ที่ต้องการ</label>
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target IP Address</label>
                <input
                  type="text"
                  value={targetIp}
                  onChange={(e) => setTargetIp(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                  required
                />
              </div>
            </div>
          )}

          {/* Justification & Approver */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              เหตุผลความจำเป็นและโครงการที่เกี่ยวข้อง
            </label>
            <textarea
              rows={3}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="ระบุวัตถุประสงค์ เช่น เพื่อใช้ในโครงการวิจัย AI ประจำภาควิชาวิศวกรรมคอมพิวเตอร์..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              อีเมลผู้อนุมัติ (หัวหน้าภาควิชา / รองคณบดี)
            </label>
            <input
              type="email"
              value={approverEmail}
              onChange={(e) => setApproverEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-xs text-slate-400">
              ระบบจะส่งอีเมลพร้อม Secure Magic Link ให้อนุมัติได้ทันทีโดยไม่ต้องใช้เอกสารกระดาษ
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition shadow-md shadow-blue-500/20 disabled:opacity-50"
          >
            {loading ? 'กำลังประมวลผลคำร้อง...' : 'ส่งคำขอรับบริการ (Submit Request)'}
          </button>
        </form>
      )}
    </div>
  );
}
