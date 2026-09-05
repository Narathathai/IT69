# Product Requirements Document (PRD)
## Project: University Enterprise IT Service Platform (UniIT Hub)
**Document Version:** 1.0.0-MVP  
**Status:** Approved for Development  
**Target Timeline:** 6–9 Months (MVP)  
**Methodology:** Vibe Coding (AI-Assisted Engineering) with Strict Spec Guardrails  

---

## 1. Executive Summary & Problem Statements

### 1.1 Executive Summary
**UniIT Hub** คือแพลตฟอร์มบริการเทคโนโลยีสารสนเทศแบบรวมศูนย์และกระจายการดูแล (Federated IT Service Management) ระดับมหาวิทยาลัย ออกแบบมาเพื่อลดภาระการโต้ตอบของเจ้าหน้าที่ไอทีส่วนกลางและไอทีคณะ โดยเน้นการแก้ปัญหาผ่านระบบบริการตนเอง (Self-Service), ระบบตอบคำถามอัตโนมัติด้วย AI (RAG), การจัดการเหตุขัดข้องแบบโปร่งใส และการแปลงคำขอทรัพยากรไอทีเป็นกระบวนการดิจิทัลเบ็ดเสร็จ

### 1.2 Problem Statements (Pain Points ระดับมหาวิทยาลัย)
1. **Mass Seasonal Crunch:** ช่วงเปิดภาคการศึกษาและลงทะเบียนเรียน คำร้องด้านบัญชีผู้ใช้ ลืมรหัสผ่าน บัญชีถูกล็อก และ MFA ทะลักเกิน 10,000+ รายการ/สัปดาห์ ส่งผลให้คู่สายโทรศัพท์และเคาน์เตอร์บริการหยุดชะงัก
2. **"Ping-Pong" Escalation:** การขาดระบบเชื่อมโยงระหว่างไอทีคณะ (L1) กับไอทีส่วนกลาง (L2/L3) ทำให้เกิดการโยนเคสไปมา ผู้ใช้งานเสียเวลาและเกิดความไม่พอใจอย่างรุนแรง
3. **Bureaucratic IT Requests:** การขอทรัพยากรโครงสร้างพื้นฐาน (เปิดพอร์ต Firewall, ขอ DNS/Subdomain, ขอ Cloud/VM) ยังใช้แบบฟอร์มกระดาษ ใช้เวลาอนุมัติ 2–6 สัปดาห์ ก่อให้เกิด Shadow IT นอกมาตรฐานความปลอดภัย
4. **License & Quota Chaos:** การจัดสรรซอฟต์แวร์ Campus Agreement (MS 365, Adobe, Zoom, MATLAB) และพื้นที่คลาวด์ขาดระบบตรวจสอบสิทธิ์และโควตาอัตโนมัติ ทำให้สูญเสียงบประมาณซ้ำซ้อน
5. **Outage Blindness:** เวลาระบบหลัก (เช่น REG, Wi-Fi ทั่ว ม.) ขัดข้อง ขาดช่องทางการสื่อสารสถานะแบบ Real-time จนผู้ใช้แห่เปิด Ticket และโทรศัพท์ซ้ำซ้อนจนระบบบริการล่ม

---

## 2. Target Personas

| Persona | บทบาทและพฤติกรรมหลัก | ความต้องการสูงสุด (Core Need) |
| :--- | :--- | :--- |
| **P1: นิสิต/นักศึกษา** | เข้าใช้งานผ่านมือถือ/LINE เป็นหลัก ใช้งานช่วงกลางคืนสูง | ปลดล็อกบัญชี/รีเซ็ตรหัสผ่านได้ทันที และรู้ว่าทำไมระบบลงทะเบียนถึงเข้าไม่ได้ |
| **P2: คณาจารย์ / นักวิจัย** | ต้องการความสะดวกรวดเร็ว ไม่ชอบขั้นตอนเอกสารซับซ้อน | ขอเปิดพอร์ต/VM และติดตั้งซอฟต์แวร์วิชาการได้เร็วเพื่อไม่ให้สะดุดงานวิจัย |
| **P3: เจ้าหน้าที่ไอทีประจำคณะ (L1)** | ด่านหน้ารับแรงกระแทกจากผู้ใช้ประจำตึก | เครื่องมือตรวจสอบปัญหาและปุ่มกดส่งต่อเคสเข้าส่วนกลาง (L2) ได้พร้อมข้อมูลครบถ้วน |
| **P4: วิศวกรไอทีส่วนกลาง (L2/L3)** | ผู้ดูแลระบบ Core Network, Identity, Cloud, และ Enterprise App | ไม่ต้องการรับโทรศัพท์งานพื้นฐาน ต้องการสมาธิในการกู้ระบบและงานพัฒนาเชิงรุก |
| **P5: ผู้บริหารไอที (CIO / ผอ.สำนัก)** | ควบคุมงบประมาณ ความปลอดภัย และประสิทธิภาพองค์กร | แดชบอร์ดสรุป SLA, ปริมาณงานจริง, ปัญหาเรื้อรัง และความคุ้มค่าของซอฟต์แวร์ |

---

## 3. Core Modules & Detailed User Stories (MoSCoW)

### 3.1 Module 01: Self-Service IAM & SSPR (MOD-01)
* **FEAT-101 (Must): Self-Service Password Reset (SSPR) via OTP**
  * *User Story:* ในฐานะนักศึกษา/บุคลากร ฉันต้องการรีเซ็ตรหัสผ่านกลางได้ด้วยตนเองผ่าน OTP (เบอร์มือถือที่ลงทะเบียนไว้) เพื่อเข้าสู่ระบบได้ทันที 24 ชั่วโมง
  * *Acceptance Criteria:*
    * Given: ผู้ใช้จำรหัสผ่านไม่ได้และระบุรหัสนักศึกษา/เลขบัตรประชาชนถูกต้อง
    * When: ร้องขอ OTP ระบบต้องส่งรหัส 6 หลักทาง SMS ภายใน 10 วินาที
    * Then: เมื่อกรอก OTP ถูกต้อง ระบบต้องอนุญาตให้ตั้งรหัสผ่านใหม่ตามเกณฑ์ความปลอดภัย และซิงค์ไปยัง Active Directory/LDAP ทันที
* **FEAT-102 (Must): Account Status & Lockout Diagnostic**
  * *User Story:* ในฐานะผู้ใช้ ฉันต้องการทราบสาเหตุที่เข้าใช้งานไม่ได้ (เช่น บัญชีพ้นสภาพ, ถูกระงับชั่วคราว, กรอกรหัสผิดเกิน 5 ครั้ง) พร้อมคำแนะนำในการแก้ไข
* **FEAT-103 (Should): Emergency Identity Proofing (เบอร์มือถือเปลี่ยน)**
  * *User Story:* ในฐานะผู้ใช้ที่เปลี่ยนเบอร์มือถือ ฉันต้องการยืนยันตัวตนผ่านอีเมลสำรองหรือคำถามความปลอดภัยเพื่ออัปเดตเบอร์รับ OTP

### 3.2 Module 02: Federated Enterprise ITSM & Helpdesk (MOD-02)
* **FEAT-201 (Must): Multi-Tenant Ticket Ingestion & Routing**
  * *User Story:* ในฐานะผู้ใช้ ฉันต้องการส่งคำร้องผ่าน Web Portal, LINE OA หรือ Email โดยระบบจะจัดคิวและส่งต่อไปยังไอทีคณะหรือไอทีกลางตามหมวดหมู่อัตโนมัติ
* **FEAT-202 (Must): One-Click Cross-Department Escalation**
  * *User Story:* ในฐานะเจ้าหน้าที่ไอทีคณะ (L1) เมื่อไม่สามารถแก้ปัญหาเชิงลึกได้ ฉันต้องการกดปุ่ม Escalate เพื่อโอนเคสไปให้ทีมไอทีกลาง (L2) โดยระบบส่งประวัติเดิมและ Diagnostic Log ไปด้วยโดยอัตโนมัติ
* **FEAT-203 (Must): Inter-Department SLA & Tracking Engine**
  * *User Story:* ในฐานะหัวหน้างานบริการ ฉันต้องการระบบจับเวลา SLA ของแต่ละระดับ (L1 $\le 4$ ชม., L2 $\le 24$ ชม.) พร้อมระบบแจ้งเตือนก่อนหลุด SLA
* **FEAT-204 (Should): Automatic Diagnostics Attachment**
  * *User Story:* ในฐานะวิศวกร L2 ฉันต้องการให้ระบบบันทึก IP, Subnet, และ Client User-Agent ลงใน Ticket เพื่อใช้ในการวิเคราะห์ปัญหาเครือข่าย

### 3.3 Module 03: Campus-Wide AI Support Bot & Central KB (MOD-03)
* **FEAT-301 (Must): RAG-Based 24/7 Virtual Support Assistant**
  * *User Story:* ในฐานะผู้ใช้ ฉันต้องการสอบถามขั้นตอนการตั้งค่า eduroam, VPN, และการใช้งาน Office 365 ผ่านแชตภาษาไทยที่เป็นธรรมชาติ และได้รับคำตอบที่ถูกต้องตามระเบียบล่าสุด
* **FEAT-302 (Must): Seamless Human Handoff with Context**
  * *User Story:* ในฐานะผู้ใช้ เมื่อบอตไม่สามารถแก้ปัญหาได้ ระบบต้องเปิด Ticket ให้อัตโนมัติพร้อมแนบประวัติการสนทนา เพื่อให้เจ้าหน้าที่เข้ามาสานต่อได้ทันที
* **FEAT-303 (Should): Knowledge Article Rating & Gap Detection**
  * *User Story:* ในฐานะผู้ดูแล KB ฉันต้องการระบบบันทึก Feedback (Like/Dislike) และรวมรวมคำถามที่บอตตอบไม่ได้ เพื่อนำไปปรับปรุงเอกสาร

### 3.4 Module 04: Public Status Page & Outage Notifier (MOD-04)
* **FEAT-401 (Must): Public Independent Status Dashboard**
  * *User Story:* ในฐานะประชาคมมหาวิทยาลัย ฉันต้องการเข้าดูสถานะของระบบหลัก (Wi-Fi, REG, LMS, Mail, VPN) ได้ตลอดเวลา แม้ระบบเครือข่ายภายในจะล่ม
* **FEAT-402 (Must): Incident Outage Banner & Push Alert**
  * *User Story:* ในฐานะผู้ดูแลระบบ เมื่อมีเหตุระบบล่ม ฉันต้องการเผยแพร่ประกาศฉุกเฉินบนหน้าเว็บและ Broadcast ผ่าน LINE OA เพื่อลดการติดต่อ
* **FEAT-403 (Must): Smart Duplicate Ticket Suppression**
  * *User Story:* ในฐานะหัวหน้า Helpdesk ระหว่างเกิดเหตุขัดข้องใหญ่ ระบบต้องตรวจจับและระงับการสร้าง Ticket ซ้ำซ้อนในหมวดหมู่นั้นๆ โดยแจ้งเตือนให้ผู้ใช้ทราบถึง Incident ที่กำลังดำเนินการอยู่
* **FEAT-404 (Should): Automated Synthetic Probing**
  * *User Story:* ในฐานะ System Admin ระบบต้องยิง Probe ตรวจสอบ HTTP/Ping ระบบหลักทุกๆ 60 วินาที และเปลี่ยนสถานะบนแดชบอร์ดอัตโนมัติ

### 3.5 Module 05: Digital Infrastructure Catalog & Workflow (MOD-05)
* **FEAT-501 (Must): Standard Digital Service Catalog**
  * *User Story:* ในฐานะอาจารย์/นักวิจัย ฉันต้องการส่งคำขอเปิดพอร์ต Firewall, ขอ Subdomain และขอ VM ผ่านแบบฟอร์มที่มีการ Validate ค่าที่จำเป็นครบถ้วน
* **FEAT-502 (Must): 2-Tier Digital Approval via Secure Magic Link**
  * *User Story:* ในฐานะหัวหน้าภาควิชา/คณบดี ฉันต้องการกดอนุมัติคำร้องผ่านลิงก์ปลอดภัยในอีเมลได้ในคลิกเดียวโดยไม่ต้องเข้าล็อกอินระบบที่ยุ่งยาก
* **FEAT-503 (Should): Campus Software License Self-Claim**
  * *User Story:* ในฐานะนักศึกษา ฉันต้องการกดเคลม License ซอฟต์แวร์ตามสิทธิ์และโควตาของคณะตนเอง และได้รับ License Key/สิทธิ์ทันที
* **FEAT-504 (Could): Automated Provisioning Webhooks**
  * *User Story:* ในฐานะ System Admin เมื่อคำขอ Subdomain ได้รับอนุมัติ ระบบสามารถยิง Webhook ไปสร้าง DNS Record บน Cloudflare/PowerDNS โดยอัตโนมัติ

---

## 4. Out-of-Scope (ขอบเขตที่ "ไม่ทำ" ในเวอร์ชัน MVP)
1. **Physical Asset Tracking via Barcode Scanner:** การเดินตรวจนับครุภัณฑ์คอมพิวเตอร์ทางกายภาพ (ให้ใช้ระบบพัสดุเดิมของมหาวิทยาลัย)
2. **Paid Software Payment Gateway:** ระบบตัดเงินค่าซอฟต์แวร์ (MVP รองรับเฉพาะ Free Campus License และโควตาคณะ)
3. **Full Replacement of Core SIS/HRIS:** ระบบนี้ไม่แทนที่ระบบทะเบียนหรือระบบเงินเดือนเดิม แต่ทำงานเป็น Middleware & Service Layer
4. **Legacy PBX Hardphone Integration:** การเชื่อมต่อระบบโทรศัพท์ตู้สาขาแบบอนาล็อก (ใช้การแจ้งเตือนแบบดิจิทัลทดแทน)

---

## 5. Success Metrics & Target KPIs

| ดัชนีชี้วัด (KPI) | ค่าเดิม (Baseline) | เป้าหมาย MVP (Target) |
| :--- | :--- | :--- |
| **Ticket Deflection Rate (สกัดกั้นงานซ้ำซาก)** | 0% (คนตอบ 100%) | $\ge 50\%$ ถูกแก้ด้วย SSPR, KB และ AI Bot |
| **Peak Season Call Volume (สายโทรเข้าช่วงเปิดเทอม)** | 2,500+ สาย/วัน | ลดลง $\ge 60\%$ (เหลือไม่เกิน 1,000 สาย/วัน) |
| **Mean Time to Resolve - MTTR (เวลาเฉลี่ยในการปิดเคส)** | 48–72 ชั่วโมง | $\le 8$ ชั่วโมง สำหรับเคสทั่วไป |
| **Infrastructure Request Cycle Time** | 14–30 วัน (กระดาษ) | $\le 2$ วันทำการ (ดิจิทัล) |
| **User CSAT Score (ความพึงพอใจการบริการ)** | 3.1 / 5.0 | $\ge 4.2 / 5.0$ |
