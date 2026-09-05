# Database Schema & Data Contracts
## Project: University Enterprise IT Service Platform (UniIT Hub)
**Document Version:** 1.0.0  
**Database Engine:** PostgreSQL 16 + pgvector  
**ORM Definition:** Drizzle ORM (TypeScript-First)  

---

## 1. Schema Conventions & Standard Columns

1. **Primary Key:** ใช้ `UUIDv7` ทุกตาราง (Time-sortable, Index friendly, ป้องกัน ID Enumeration Attack)
2. **Naming Convention:** `snake_case` สำหรับชื่อตารางและคอลัมน์ทั้งหมด
3. **Standard Audit Columns:** ทุกตารางต้องมีคอลัมน์พื้นฐานดังนี้:
   ```sql
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- หรือ uuid_generate_v7()
   created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
   deleted_at TIMESTAMPTZ NULL -- Soft delete
   ```
4. **Logical Schemas (Namespaces):**
   * `iam`: ตารางเกี่ยวกับผู้ใช้งาน, บัญชี, สิทธิ์, และ OTP
   * `itsm`: ตาราง Ticket, การส่งต่องาน, ข้อความสนทนา, และ SLA
   * `kb`: ตารางบทความคลังความรู้ และ Vector Embeddings
   * `status`: ตารางบริการหลัก, สถานะขัดข้อง (Incidents), และ Synthetic Probes
   * `catalog`: ตารางแบบฟอร์มคำขอโครงสร้างพื้นฐาน และขั้นตอนการอนุมัติ
   * `audit`: ตาราง Audit Logs สำหรับบันทึกความปลอดภัยตาม พ.ร.บ.คอมพิวเตอร์

---

## 2. Common Enums

```sql
-- บทบาทผู้ใช้งาน
CREATE TYPE iam.user_role AS ENUM (
  'STUDENT',
  'FACULTY_STAFF',
  'FACULTY_IT_L1',
  'CENTRAL_IT_L2_L3',
  'SUPER_ADMIN'
);

-- สถานะบัญชีผู้ใช้
CREATE TYPE iam.account_status AS ENUM (
  'ACTIVE',
  'LOCKED_PASSWORD_ATTEMPTS',
  'SUSPENDED_STATUS_CHANGE',
  'EXPIRED'
);

-- ระดับความรุนแรงและสถานะ Ticket
CREATE TYPE itsm.ticket_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE itsm.ticket_tier AS ENUM ('TIER_1_FACULTY', 'TIER_2_CENTRAL_SUPPORT', 'TIER_3_SPECIALIST');
CREATE TYPE itsm.ticket_status AS ENUM (
  'NEW',
  'ASSIGNED',
  'IN_PROGRESS',
  'PENDING_USER',
  'PENDING_VENDOR',
  'RESOLVED',
  'CLOSED'
);

-- สถานะความพร้อมของระบบ (Status Page)
CREATE TYPE status.service_state AS ENUM ('OPERATIONAL', 'DEGRADED', 'PARTIAL_OUTAGE', 'MAJOR_OUTAGE');
CREATE TYPE status.incident_impact AS ENUM ('NONE', 'MINOR', 'MAJOR', 'CRITICAL');

-- สถานะคำขอทรัพยากรไอที (Service Catalog)
CREATE TYPE catalog.request_status AS ENUM (
  'SUBMITTED',
  'PENDING_DEAN_APPROVAL',
  'PENDING_IT_REVIEW',
  'APPROVED',
  'PROVISIONED',
  'REJECTED',
  'CANCELLED'
);
```

---

## 3. Detailed Table Definitions by Namespace

### 3.1 Namespace `iam` (Identity & SSPR)

```sql
-- ฐานข้อมูลบัญชีผู้ใช้ (Local Shadow Profile ซิงค์จาก LDAP/SIS)
CREATE TABLE iam.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(64) UNIQUE NOT NULL, -- รหัสนักศึกษา หรือ บุคลากร
    citizen_id_hash VARCHAR(64) NOT NULL, -- SHA-256 ของเลขบัตรประชาชน
    full_name_th VARCHAR(255) NOT NULL,
    full_name_en VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    secondary_email VARCHAR(255),
    phone_number VARCHAR(32), -- เบอร์มือถือรับ OTP (เข้ารหัส)
    role iam.user_role NOT NULL DEFAULT 'STUDENT',
    faculty_id VARCHAR(32) NOT NULL, -- รหัสคณะ/หน่วยงาน
    department_name VARCHAR(128),
    account_status iam.account_status NOT NULL DEFAULT 'ACTIVE',
    last_sync_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- ประวัติการขอรหัส OTP สำหรับ SSPR
CREATE TABLE iam.otp_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES iam.users(id),
    otp_code_hash VARCHAR(64) NOT NULL,
    channel VARCHAR(16) NOT NULL, -- 'SMS' หรือ 'EMAIL'
    recipient VARCHAR(255) NOT NULL,
    reference_code VARCHAR(10) NOT NULL,
    attempts_left SMALLINT NOT NULL DEFAULT 3,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_iam_users_username ON iam.users(username);
CREATE INDEX idx_iam_users_faculty ON iam.users(faculty_id);
```

---

### 3.2 Namespace `itsm` (Ticketing & Helpdesk)

```sql
-- ตารางคำร้อง/ปัญหา (Tickets)
CREATE TABLE itsm.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(32) UNIQUE NOT NULL, -- เช่น T-2026-0001
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requester_id UUID NOT NULL REFERENCES iam.users(id),
    assigned_to_id UUID REFERENCES iam.users(id),
    faculty_id VARCHAR(32) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'WIFI', 'VPN', 'EMAIL', 'HARDWARE', 'SOFTWARE'
    priority itsm.ticket_priority NOT NULL DEFAULT 'MEDIUM',
    tier itsm.ticket_tier NOT NULL DEFAULT 'TIER_1_FACULTY',
    status itsm.ticket_status NOT NULL DEFAULT 'NEW',
    sla_target_at TIMESTAMPTZ NOT NULL,
    resolved_at TIMESTAMPTZ,
    channel VARCHAR(32) NOT NULL DEFAULT 'WEB', -- 'WEB', 'LINE', 'EMAIL', 'AI_BOT'
    suppressed_by_incident_id UUID, -- เชื่อมกับเหตุขัดข้องหลัก (ถ้ามี)
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- การส่งข้อความโต้ตอบและการบันทึกใน Ticket
CREATE TABLE itsm.ticket_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES itsm.tickets(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES iam.users(id),
    content TEXT NOT NULL,
    is_internal_note BOOLEAN NOT NULL DEFAULT FALSE, -- ข้อความภายในช่างเห็นเท่านั้น
    attachments JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_itsm_tickets_status_priority ON itsm.tickets(status, priority);
CREATE INDEX idx_itsm_tickets_faculty ON itsm.tickets(faculty_id);
CREATE INDEX idx_itsm_tickets_requester ON itsm.tickets(requester_id);
```

---

### 3.3 Namespace `kb` (Knowledge Base & Vector Store)

```sql
CREATE EXTENSION IF NOT EXISTS vector;

-- คลังบทความคู่มือ
CREATE TABLE kb.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(64) NOT NULL,
    content_markdown TEXT NOT NULL,
    target_audience iam.user_role[] NOT NULL DEFAULT '{STUDENT,FACULTY_STAFF}',
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    view_count INT NOT NULL DEFAULT 0,
    helpful_votes INT NOT NULL DEFAULT 0,
    unhelpful_votes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Vector Embeddings สำหรับ RAG AI Assistant
CREATE TABLE kb.embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES kb.articles(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    chunk_content TEXT NOT NULL,
    embedding vector(1536) NOT NULL, -- ขนาด 1536 สำหรับ Gemini/OpenAI Embedding
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- HNSW Index สำหรับการค้นหา Vector ความเร็วสูง
CREATE INDEX idx_kb_embeddings_hnsw ON kb.embeddings USING hnsw (embedding vector_cosine_ops);
```

---

### 3.4 Namespace `status` (Status Page & Incident Management)

```sql
-- รายการบริการหลักของมหาวิทยาลัย
CREATE TABLE status.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    description VARCHAR(255),
    category VARCHAR(64) NOT NULL, -- 'NETWORK', 'ACADEMIC_SYS', 'OFFICE_APP'
    current_state status.service_state NOT NULL DEFAULT 'OPERATIONAL',
    display_order INT NOT NULL DEFAULT 0,
    probe_url VARCHAR(512), -- URL สำหรับรัน Synthetic Health Check
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- เหตุการณ์ขัดข้อง (Incidents)
CREATE TABLE status.incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    impact status.incident_impact NOT NULL DEFAULT 'MINOR',
    summary TEXT NOT NULL,
    affected_service_ids UUID[] NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

### 3.5 Namespace `catalog` (Digital IT Service Catalog & Approvals)

```sql
-- รายการคำร้องขอทรัพยากรไอที
CREATE TABLE catalog.requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_type VARCHAR(64) NOT NULL, -- 'FIREWALL_RULE', 'DNS_RECORD', 'VM_INSTANCE'
    requester_id UUID NOT NULL REFERENCES iam.users(id),
    status catalog.request_status NOT NULL DEFAULT 'SUBMITTED',
    form_data JSONB NOT NULL, -- ข้อมูลเฉพาะของแต่ละคำขอ เช่น IP, Port, Specs
    justification TEXT NOT NULL,
    current_approver_id UUID REFERENCES iam.users(id),
    approval_token VARCHAR(128) UNIQUE, -- Secure Magic Token สำหรับคลิกอนุมัติทางอีเมล
    token_expires_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

### 3.6 Namespace `audit` (Compliance & Security Audit Trail)

```sql
CREATE TABLE audit.system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    ip_address INET NOT NULL,
    user_agent TEXT,
    action_type VARCHAR(64) NOT NULL, -- 'AUTH_SSPR', 'TICKET_ESCALATE', 'APPROVAL_GRANTED'
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(64),
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_created_at ON audit.system_logs(created_at DESC);
```
