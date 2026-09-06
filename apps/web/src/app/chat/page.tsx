'use client';

import React, { useState } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  suggestedAction?: 'SELF_SERVE' | 'VISIT_SSPR' | 'CHECK_STATUS' | 'OPEN_TICKET';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'สวัสดีค่ะ! ดิฉันคือ AI ผู้ช่วยบริการเทคโนโลยีสารสนเทศของมหาวิทยาลัย มีปัญหาด้าน Wi-Fi, VPN, บัญชีผู้ใช้, หรือห้องเรียน สอบถามได้ทันทีตลอด 24 ชั่วโมงค่ะ',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [handoffTicket, setHandoffTicket] = useState<string | null>(null);

  const quickPrompts = [
    'วิธีต่อ Wi-Fi eduroam',
    'ลืมรหัสผ่านเข้าเว็บไม่ได้',
    'วิธีต่อ VPN จากบ้าน',
    'โปรเจกเตอร์ในห้องเรียนภาพไม่ขึ้น',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const lower = query.toLowerCase();

      if (lower.includes('wifi') || lower.includes('eduroam') || lower.includes('เน็ต')) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: '【วิธีเชื่อมต่อ eduroam】\n1. เลือก Wi-Fi ชื่อ "eduroam"\n2. Username: รหัสนักศึกษา@university.ac.th\n3. Password: รหัสผ่านบัญชีกลาง\n4. สำหรับ iOS/Mac กด Trust Certificate\n5. สำหรับ Android เลือก PEAP / MSCHAPV2 ค่ะ',
            suggestedAction: 'SELF_SERVE',
          },
        ]);
      } else if (lower.includes('ลืมรหัส') || lower.includes('password') || lower.includes('ล็อก')) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: 'หากลืมรหัสผ่านหรือบัญชีถูกล็อก สามารถใช้งานระบบ Self-Service Password Reset (SSPR) ได้ด้วยตนเองทันทีผ่านเบอร์มือถือที่ลงทะเบียนไว้ค่ะ',
            suggestedAction: 'VISIT_SSPR',
          },
        ]);
      } else if (lower.includes('vpn')) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: '【วิธีต่อ Campus VPN】\n1. ดาวน์โหลดโปรแกรม FortiClient ที่ https://vpn.university.ac.th\n2. Server: vpn.university.ac.th พอร์ต 443\n3. ล็อกอินด้วยบัญชีกลางและยืนยันรหัส OTP ในโทรศัพท์เพื่อเริ่มใช้งานค่ะ',
            suggestedAction: 'SELF_SERVE',
          },
        ]);
      } else if (lower.includes('โปรเจกเตอร์') || lower.includes('ห้องเรียน') || lower.includes('ไมค์')) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: '【แก้ปัญหาห้องเรียน Smart Classroom】\n1. ตรวจสอบสวิตช์ HDMI/Type-C บนโต๊ะอาจารย์\n2. กดปุ่ม Windows + P เลือก Duplicate\n3. หากแก้ไขไม่ได้ สามารถสแกน QR Code ประจำห้องเพื่อเรียกช่างเวรเข้าแก้ไขด่วนภายใน 5 นาทีค่ะ',
            suggestedAction: 'SELF_SERVE',
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: 'ขออภัยค่ะ ระบบยังไม่พบคำตอบสำหรับกรณีนี้โดยตรง คุณต้องการให้ส่งเรื่องต่อให้เจ้าหน้าที่ไอทีเปิด Ticket ติดต่อกลับหรือไม่คะ?',
            suggestedAction: 'OPEN_TICKET',
          },
        ]);
      }
    }, 600);
  };

  const handleHandoff = () => {
    const mockTicketNo = `T-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setHandoffTicket(mockTicketNo);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: `ส่งเรื่องให้เจ้าหน้าที่เรียบร้อยแล้วค่ะ! เลขที่คำร้องของคุณคือ "${mockTicketNo}" โดยช่างไอทีจะเข้ามาตรวจสอบตาม SLA ภายใน 8 ชั่วโมงค่ะ`,
      },
    ]);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[75vh] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
            🤖
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">UniIT AI Support Assistant</h3>
            <p className="text-xs text-emerald-600 font-medium flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>พร้อมตอบคำถาม 24 ชั่วโมง</span>
            </p>
          </div>
        </div>
        <button
          onClick={handleHandoff}
          className="text-xs px-3 py-1.5 rounded-lg border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 font-medium transition"
        >
          ขอคุยกับเจ้าหน้าที่ (Handoff)
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-lg p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-100 text-slate-900 rounded-bl-none'
              }`}
            >
              {msg.text}
              {msg.suggestedAction === 'VISIT_SSPR' && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <a
                    href="/sspr"
                    className="inline-block px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
                  >
                    ไปที่ระบบรีเซ็ตรหัสผ่าน (SSPR) →
                  </a>
                </div>
              )}
              {msg.suggestedAction === 'OPEN_TICKET' && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <button
                    onClick={handleHandoff}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 transition"
                  >
                    สร้าง Ticket ส่งให้เจ้าหน้าที่ด่วน
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-3 bg-slate-100 text-slate-500 rounded-2xl text-xs flex items-center space-x-2">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce delay-100">●</span>
              <span className="animate-bounce delay-200">●</span>
              <span>กำลังค้นหาข้อมูลในคลังความรู้...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-6 py-2 border-t border-slate-100 bg-slate-50 flex items-center space-x-2 overflow-x-auto text-xs">
        <span className="text-slate-400 whitespace-nowrap font-medium">คำถามยอดนิยม:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 whitespace-nowrap transition"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100 flex items-center space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="พิมพ์คำถามของคุณที่นี่ เช่น 'ต่อไวไฟไม่ได้', 'ขอสิทธิ์ Adobe'..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-900"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={loading || !input.trim()}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition shadow-sm disabled:opacity-50"
        >
          ส่ง
        </button>
      </div>
    </div>
  );
}
