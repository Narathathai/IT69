# Implementation & Engineering Roadmap
## Project: University Enterprise IT Service Platform (UniIT Hub)
**Document Version:** 1.0.0  
**Methodology:** AI-Assisted Vibe Coding with Micro-Task Verification  
**Total Target Duration:** 28 Weeks (approx. 7 Months)  

---

## 1. Phased Roadmap Overview

```
[Phase 1: Urgent Relief & Core Infra] (Weeks 1 - 8)
 ├── Turborepo & Monorepo Foundation Setup
 ├── MOD-01: IAM & Self-Service Password Reset (SSPR)
 └── MOD-04: Public Real-time Status Page & Outage Notifier

[Phase 2: Operational Hub & Intelligence] (Weeks 9 - 18)
 ├── MOD-02: Multi-Tenant Federated ITSM & Escalation Engine
 ├── MOD-03: AI Support Bot & pgvector Knowledge Engine
 └── LINE Official Account & Email Ingestion Integration

[Phase 3: Digital Transformation & Production Hardening] (Weeks 19 - 28)
 ├── MOD-05: Digital Infrastructure Catalog & Magic Link Approval
 ├── Legacy Integrations (SIS, HRIS, LDAP, SMS Gateway Connectors)
 └── Load Testing, Penetration Testing & Pilot Launch (2 Pilot Faculties)
```

---

## 2. Micro-Task Breakdown for AI Coding Agents

ทุก Task ถูกออกแบบให้มีขนาดไม่เกิน 150–200 บรรทัดของโค้ด เพื่อให้ AI Agent สามารถ Generate, Test และ Review ได้อย่างสมบูรณ์ใน 1 Context Window:

### Phase 1: Foundation, IAM & Status Page

* **TASK-FND-01: Monorepo Scaffold & Tooling**
  * *Scope:* สร้างโครงสร้าง Turborepo, pnpm workspaces, ติดตั้ง TypeScript, ESLint, Prettier, TailwindCSS
  * *Verification:* `pnpm build && pnpm lint` ผ่านฉลุย
* **TASK-FND-02: Database & Drizzle ORM Setup**
  * *Scope:* สร้าง `/packages/database`, กำหนด Schema ตาม `schema.md`, ติดตั้ง Docker Compose รัน PostgreSQL 16 + pgvector
  * *Verification:* `pnpm --filter @uni-it/database db:generate && pnpm --filter @uni-it/database db:migrate`
* **TASK-IAM-01: User Shadow Profile Sync & Adapter Interface**
  * *Scope:* สร้าง Domain Service ใน `/modules/iam` สำหรับอ่านข้อมูลผู้ใช้และ Sync Profile ชั่วคราว
  * *Verification:* Unit Test mock ข้อมูล LDAP/SIS ผ่าน 100%
* **TASK-IAM-02: SSPR Request & OTP Flow Engine**
  * *Scope:* ฟังก์ชันร้องขอ OTP, แฮช OTP, บันทึกลง `iam.otp_requests` พร้อม Rate Limit (3 ครั้ง/15 นาที)
  * *Verification:* Unit Test ตรวจสอบ Timeout และรหัสอ้างอิง Reference Code
* **TASK-IAM-03: Password Reset Web UI (Student Facing)**
  * *Scope:* สร้างหน้ากากเว็บ SSPR ใน `/apps/web` (Next.js) รองรับมือถือ 100% พร้อม Validation รหัสผ่านตามเกณฑ์
  * *Verification:* E2E Test จำลองการกรอกรหัสนักศึกษา -> รับ OTP -> ตั้งรหัสใหม่
* **TASK-STA-01: Status Page Public Frontend & Edge Cache**
  * *Scope:* สร้างหน้า Public Status Dashboard แสดงสถานะระบบเขียว/เหลือง/แดง ใน `/apps/web`
  * *Verification:* รัน Lighthouse Performance ตรวจสอบคะแนน Performance $\ge 95$
* **TASK-STA-02: Synthetic Health Checker Worker**
  * *Scope:* สร้าง Background Job ใน BullMQ ยิง Ping/HTTP ไปยังเซิร์ฟเวอร์หลัก และปรับสถานะใน `status.services`
  * *Verification:* ทดสอบส่ง Mock Failure แล้วระบบอัปเดตสถานะเป็น DEGRADED อัตโนมัติ

---

### Phase 2: Federated ITSM & AI Support Bot

* **TASK-ITSM-01: Ticket Creation API & Number Generator**
  * *Scope:* สร้าง tRPC Endpoint สำหรับเปิด Ticket พร้อมฟังก์ชันสร้างเลขที่ Ticket (`T-YYYY-XXXXX`)
  * *Verification:* ตรวจสอบการบันทึกข้อมูลและ Audit Log ใน `audit.system_logs`
* **TASK-ITSM-02: One-Click Escalation Engine (L1 to L2)**
  * *Scope:* Logic การโอนย้าย Ticket ข้ามสังกัดคณะเข้าสู่ส่วนกลาง พร้อมส่ง Redis Event `ticket.escalated`
  * *Verification:* ทดสอบเปลี่ยน Tier จาก `TIER_1_FACULTY` เป็น `TIER_2_CENTRAL_SUPPORT`
* **TASK-ITSM-03: ITSM Admin Console (Kanban & Ticket View)**
  * *Scope:* สร้างหน้าจัดการเคสสำหรับช่างและเจ้าหน้าที่ใน `/apps/admin` (แยก View คณะ และ View กลาง)
  * *Verification:* Component Test ตรวจสอบการ Filter ตามสังกัดคณะและสถานะงาน
* **TASK-AI-01: Knowledge Base Markdown Ingestion & Chunking**
  * *Scope:* สคริปต์แปลงไฟล์คู่มือ Markdown เป็น Chunks และยิงสร้าง Embeddings ลงตาราง `kb.embeddings`
  * *Verification:* รันคำสั่ง Seed บทความ 10 บทความ และตรวจสอบมิติ Vector 1536 มิติ
* **TASK-AI-02: RAG Retrieval & Chat Assistant Route**
  * *Scope:* API รับคำถามผู้ใช้ -> ทำ Vector Cosine Similarity Search -> ส่ง Prompt ให้ LLM สรุปคำตอบ
  * *Verification:* ทดสอบถามวิธีตั้งค่า eduroam แล้วได้คำตอบตรงตามเอกสารคู่มือ
* **TASK-AI-03: Human Handoff with Chat History Extraction**
  * *Scope:* ปุ่มกด "คุยกับเจ้าหน้าที่" ในหน้าแชตบอต ดึงบทสนทนาสรุปย่อ แล้วเปิด Ticket ใน `itsm.tickets`
  * *Verification:* ทดสอบ Handoff แล้วพบ Ticket ใหม่พร้อม Comment ประวัติแชต

---

### Phase 3: Digital Catalog & Enterprise Hardening

* **TASK-CAT-01: Service Request Form & Dynamic JSON Schema**
  * *Scope:* ฟอร์มขอเปิดพอร์ต Firewall, ขอ Subdomain พร้อม Validate JSON Schema ใน `/modules/infra-catalog`
  * *Verification:* ทดสอบกรอก IP / Port ถูกต้องผ่าน, กรอกผิดต้องแสดง Error ทันที
* **TASK-CAT-02: 2-Tier Magic Link Approval System**
  * *Scope:* สร้าง Secure Token 128-bit ส่งอีเมลหาหัวหน้าภาค/คณบดี ให้กด Approve/Reject ได้โดยไม่ต้องล็อกอิน
  * *Verification:* ทดสอบคลิกลิงก์ Token หมดอายุต้องขึ้น 403, ลิงก์ถูกต้องสถานะเปลี่ยนเป็น APPROVED
* **TASK-INT-01: Legacy System Adapters & Circuit Breaker Guard**
  * *Scope:* ห่อหุ้ม API เชื่อมต่อ SIS, HRIS, SMS ด้วย Circuit Breaker (Opossum)
  * *Verification:* Mock เซิร์ฟเวอร์ภายนอกตาย 5 ครั้ง ติดต่อกัน ต้องตัด Connection ทันที
* **TASK-SEC-01: Security Penetration Test & Audit Log Review**
  * *Scope:* ตรวจสอบ OWASP Top 10, SQL Injection, IDOR, และความสมบูรณ์ของ Log ตาม พ.ร.บ.คอมฯ
  * *Verification:* รันเครื่องมือสแกนช่องโหว่ความปลอดภัยแบบอัตโนมัติ

---

## 3. Definition of Done (DoD) สำหรับแต่ละ Task

ก่อนที่ AI Coding Agent จะถือว่างานเสร็จสิ้น ต้องผ่านเกณฑ์ต่อไปนี้ทุกข้อ:
1. **Type Safety:** รัน `pnpm typecheck` ผ่าน 100% โดยไม่มีการใช้ `any` หรือ `@ts-ignore`
2. **Automated Test:** มี Unit Test หรือ Integration Test ครอบคลุมโค้ดใหม่ (Pass 100%)
3. **No File Overwrite Chaos:** ห้ามลบโค้ดเดิมที่มีอยู่โดยไม่ได้ระบุในคำสั่ง
4. **Git Commit Format:** Commit ด้วยมาตรฐาน Conventional Commits (เช่น `feat(itsm): implement ticket escalation`)
5. **Progress Update:** อัปเดตสถานะงานใน `progress.md` ทุกครั้ง
