export interface KbArticle {
  id: string;
  title: string;
  category: 'WIFI' | 'VPN' | 'SOFTWARE' | 'CLASSROOM' | 'ACCOUNT';
  keywords: string[];
  summary: string;
  content: string;
}

export const UNIVERSITY_KB: KbArticle[] = [
  {
    id: 'kb-01',
    title: 'วิธีเชื่อมต่อเครือข่าย eduroam และ Wi-Fi มหาวิทยาลัย',
    category: 'WIFI',
    keywords: ['wifi', 'eduroam', 'อินเทอร์เน็ต', 'ไวไฟ', 'สัญญาณ', 'เน็ตหลุด', 'ต่อเน็ตไม่ได้'],
    summary: 'ขั้นตอนการตั้งค่า eduroam สำหรับ Windows, macOS, iOS และ Android',
    content: `1. เลือกเชื่อมต่อ SSID: "eduroam"
2. ใส่ Username: รหัสนักศึกษา@university.ac.th (หรือ user@university.ac.th สำหรับบุคลากร)
3. ใส่ Password: รหัสผ่านบัญชีกลางของมหาวิทยาลัย
4. สำหรับ iOS/macOS: กด "Trust" หรือ "เชื่อถือ" Certificate ของมหาวิทยาลัย
5. สำหรับ Android: เลือก EAP method: PEAP, Phase 2 authentication: MSCHAPV2, CA certificate: Use system certificates และใส่ Domain: university.ac.th`,
  },
  {
    id: 'kb-02',
    title: 'วิธีติดตั้งและเชื่อมต่อระบบ Campus VPN',
    category: 'VPN',
    keywords: ['vpn', 'ต่อจากบ้าน', 'เครือข่ายภายนอก', 'เข้าเว็บมหาลัยไม่ได้', 'ฐานข้อมูลวิจัย'],
    summary: 'ขั้นตอนการใช้งาน VPN เพื่อเข้าถึงระบบภายในและฐานข้อมูลงานวิจัยจากภายนอกมหาวิทยาลัย',
    content: `1. ดาวน์โหลดโปรแกรม FortiClient VPN หรือ Cisco AnyConnect จากหน้าเว็บ https://vpn.university.ac.th
2. ตั้งค่า Server Address: vpn.university.ac.th พอร์ต 443
3. ล็อกอินด้วยบัญชีกลาง (Username ไม่ต้องใส่ @university.ac.th)
4. ยืนยันรหัส OTP จากแอปพลิเคชัน 2FA
5. เมื่อขึ้นสถานะ "Connected" สามารถเข้าใช้งานระบบทะเบียน REG และฐานข้อมูล ScienceDirect/IEEE ได้เสมือนอยู่ในมหาวิทยาลัย`,
  },
  {
    id: 'kb-03',
    title: 'การขอรับสิทธิ์ใช้งาน Microsoft 365 และ Adobe Creative Cloud',
    category: 'SOFTWARE',
    keywords: ['office', 'word', 'excel', 'powerpoint', 'adobe', 'photoshop', 'ลิขสิทธิ์', 'ซอฟต์แวร์', 'สิทธิ์'],
    summary: 'ขั้นตอนการเปิดใช้งานชุดโปรแกรมลิขสิทธิ์มหาวิทยาลัยสำหรับนักศึกษาและอาจารย์',
    content: `1. นักศึกษาทุกคนจะได้รับสิทธิ์ Microsoft 365 Apps อัตโนมัติเมื่อลงทะเบียนเรียน
2. เข้าสู่ระบบที่ https://portal.office.com ด้วยอีเมลมหาวิทยาลัย
3. สามารถติดตั้งบนคอมพิวเตอร์และแท็บเล็ตได้สูงสุด 5 เครื่อง
4. สำหรับ Adobe CC: นักศึกษาคณะสายออกแบบ/สถาปัตย์ จะได้รับโควตาอัตโนมัติ ส่วนคณะอื่นสามารถยื่นขอผ่าน Digital IT Service Catalog`,
  },
  {
    id: 'kb-04',
    title: 'การแก้ไขปัญหาเบื้องต้นสำหรับระบบโสตฯ และโปรเจกเตอร์ในห้องเรียน',
    category: 'CLASSROOM',
    keywords: ['ห้องเรียน', 'โปรเจกเตอร์', 'ภาพไม่ขึ้น', 'ไมค์ไม่ดัง', 'สายhdmi', 'hybrid', 'zoom', 'สอน'],
    summary: 'ขั้นตอนแก้ไขปัญหาภาพและเสียงในห้องเรียน Smart Classroom เบื้องต้น',
    content: `1. ตรวจสอบไฟสถานะบนกล่องควบคุม (Control Box) ที่โต๊ะอาจารย์ ต้องเป็นสีเขียว
2. กดสวิตช์เลือก Source เป็น "HDMI" หรือ "Type-C" ให้ตรงกับสายที่เชื่อมต่อ
3. หากจอภาพดับหรือขึ้น "No Signal": ให้กดปุ่ม Windows + P (บน Windows) แล้วเลือก "Duplicate" หรือไปที่ System Settings > Displays (บน Mac)
4. หากไมโครโฟนไม่ดัง: ตรวจสอบระดับแบตเตอรี่ที่ด้ามไมค์ หรือหมุนลูกบิด Master Volume ที่ตู้ควบคุม
5. หากยังไม่สามารถแก้ไขได้: สแกน QR Code SOS ประจำห้อง เพื่อเรียกช่างเวรเข้าแก้ไขด่วนภายใน 5 นาที`,
  },
];
