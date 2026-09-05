import React from 'react';

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="text-center py-12 px-4 rounded-3xl bg-gradient-to-b from-blue-50/50 to-indigo-50/30 border border-blue-100">
        <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100/80 rounded-full inline-block mb-4">
          ระบบบริการดิจิทัลส่วนกลาง มหาวิทยาลัย
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          ศูนย์บริการเทคโนโลยีสารสนเทศ <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            UniIT Hub
          </span>
        </h1>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
          บริการตนเองตลอด 24 ชั่วโมง รีเซ็ตรหัสผ่าน บัญชีกลาง ตรวจสอบสถานะการเชื่อมต่อ และแจ้งปัญหาเทคโนโลยี
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="/sspr"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20 transition"
          >
            รีเซ็ตรหัสผ่านด้วยตนเอง (SSPR)
          </a>
          <a
            href="/status"
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 shadow-sm transition"
          >
            ตรวจสอบสถานะระบบไอที
          </a>
        </div>
      </section>

      {/* 4 Core Quick Access Cards */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl mb-4">
            🔑
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Self-Service SSPR</h3>
          <p className="mt-2 text-sm text-slate-600">
            ลืมรหัสผ่าน บัญชีถูกล็อก หรือต้องการเปลี่ยนรหัสผ่าน ทำรายการได้ทันทีผ่าน OTP
          </p>
          <a href="/sspr" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline">
            เริ่มรีเซ็ต →
          </a>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl mb-4">
            🟢
          </div>
          <h3 className="font-bold text-slate-900 text-lg">System Status</h3>
          <p className="mt-2 text-sm text-slate-600">
            ดูสถานะ Wi-Fi, eduroam, VPN, ระบบทะเบียน (REG) และ MS 365 แบบ Real-time
          </p>
          <a href="/status" className="mt-4 inline-block text-sm font-semibold text-emerald-600 hover:underline">
            ดูสถานะทั้งหมด →
          </a>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xl mb-4">
            🤖
          </div>
          <h3 className="font-bold text-slate-900 text-lg">AI Support Bot</h3>
          <p className="mt-2 text-sm text-slate-600">
            แชตบอตผู้ช่วยตอบคำถามวิธีตั้งค่าเครือข่ายและสิทธิ์ซอฟต์แวร์ตลอด 24 ชั่วโมง
          </p>
          <span className="mt-4 inline-block text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
            พร้อมใช้งานผ่าน LINE OA
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl mb-4">
            📋
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Service Catalog</h3>
          <p className="mt-2 text-sm text-slate-600">
            ยื่นคำร้องขอเปิดพอร์ต Firewall, ขอ Subdomain และสิทธิ์ซอฟต์แวร์วิชาการ
          </p>
          <span className="mt-4 inline-block text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
            สำหรับอาจารย์และบุคลากร
          </span>
        </div>
      </section>
    </div>
  );
}
