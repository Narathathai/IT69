CREATE SCHEMA "iam";
--> statement-breakpoint
CREATE SCHEMA "itsm";
--> statement-breakpoint
CREATE SCHEMA "status";
--> statement-breakpoint
CREATE SCHEMA "kb";
--> statement-breakpoint
CREATE SCHEMA "catalog";
--> statement-breakpoint
CREATE SCHEMA "audit";
--> statement-breakpoint
CREATE TYPE "iam"."account_status" AS ENUM('ACTIVE', 'LOCKED_PASSWORD_ATTEMPTS', 'SUSPENDED_STATUS_CHANGE', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "iam"."user_role" AS ENUM('STUDENT', 'FACULTY_STAFF', 'FACULTY_IT_L1', 'CENTRAL_IT_L2_L3', 'SUPER_ADMIN');--> statement-breakpoint
CREATE TYPE "itsm"."ticket_priority" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "itsm"."ticket_status" AS ENUM('NEW', 'ASSIGNED', 'IN_PROGRESS', 'PENDING_USER', 'PENDING_VENDOR', 'RESOLVED', 'CLOSED');--> statement-breakpoint
CREATE TYPE "itsm"."ticket_tier" AS ENUM('TIER_1_FACULTY', 'TIER_2_CENTRAL_SUPPORT', 'TIER_3_SPECIALIST');--> statement-breakpoint
CREATE TYPE "status"."incident_impact" AS ENUM('NONE', 'MINOR', 'MAJOR', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "status"."service_state" AS ENUM('OPERATIONAL', 'DEGRADED', 'PARTIAL_OUTAGE', 'MAJOR_OUTAGE');--> statement-breakpoint
CREATE TYPE "catalog"."catalog_request_status" AS ENUM('SUBMITTED', 'PENDING_DEAN_APPROVAL', 'PENDING_IT_REVIEW', 'APPROVED', 'PROVISIONED', 'REJECTED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "iam"."otp_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"otp_code_hash" varchar(64) NOT NULL,
	"channel" varchar(16) NOT NULL,
	"recipient" varchar(255) NOT NULL,
	"reference_code" varchar(10) NOT NULL,
	"attempts_left" smallint DEFAULT 3 NOT NULL,
	"is_used" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "iam"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(64) NOT NULL,
	"citizen_id_hash" varchar(64) NOT NULL,
	"full_name_th" varchar(255) NOT NULL,
	"full_name_en" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"secondary_email" varchar(255),
	"phone_number" varchar(32),
	"role" "iam"."user_role" DEFAULT 'STUDENT' NOT NULL,
	"faculty_id" varchar(32) NOT NULL,
	"department_name" varchar(128),
	"account_status" "iam"."account_status" DEFAULT 'ACTIVE' NOT NULL,
	"last_sync_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "itsm"."ticket_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"content" text NOT NULL,
	"is_internal_note" boolean DEFAULT false NOT NULL,
	"attachments" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "itsm"."tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_number" varchar(32) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"requester_id" uuid NOT NULL,
	"assigned_to_id" uuid,
	"faculty_id" varchar(32) NOT NULL,
	"category" varchar(64) NOT NULL,
	"priority" "itsm"."ticket_priority" DEFAULT 'MEDIUM' NOT NULL,
	"tier" "itsm"."ticket_tier" DEFAULT 'TIER_1_FACULTY' NOT NULL,
	"status" "itsm"."ticket_status" DEFAULT 'NEW' NOT NULL,
	"channel" varchar(32) DEFAULT 'WEB' NOT NULL,
	"sla_target_at" timestamp with time zone NOT NULL,
	"resolved_at" timestamp with time zone,
	"suppressed_by_incident_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "tickets_ticket_number_unique" UNIQUE("ticket_number")
);
--> statement-breakpoint
CREATE TABLE "status"."incidents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"impact" "status"."incident_impact" DEFAULT 'MINOR' NOT NULL,
	"summary" text NOT NULL,
	"affected_service_ids" uuid[] NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "status"."services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(128) NOT NULL,
	"description" varchar(255),
	"category" varchar(64) NOT NULL,
	"current_state" "status"."service_state" DEFAULT 'OPERATIONAL' NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"probe_url" varchar(512),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kb"."articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"category" varchar(64) NOT NULL,
	"content_markdown" text NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"helpful_votes" integer DEFAULT 0 NOT NULL,
	"unhelpful_votes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "kb"."embeddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"chunk_index" integer NOT NULL,
	"chunk_content" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "catalog"."catalog_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_type" varchar(64) NOT NULL,
	"requester_id" uuid NOT NULL,
	"status" "catalog"."catalog_request_status" DEFAULT 'SUBMITTED' NOT NULL,
	"form_data" jsonb NOT NULL,
	"justification" text NOT NULL,
	"current_approver_id" uuid,
	"approval_token" varchar(128),
	"token_expires_at" timestamp with time zone,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "catalog_requests_approval_token_unique" UNIQUE("approval_token")
);
--> statement-breakpoint
CREATE TABLE "audit"."system_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"ip_address" varchar(64) NOT NULL,
	"user_agent" text,
	"action_type" varchar(64) NOT NULL,
	"resource_type" varchar(64) NOT NULL,
	"resource_id" varchar(64),
	"payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "iam"."otp_requests" ADD CONSTRAINT "otp_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "iam"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itsm"."ticket_comments" ADD CONSTRAINT "ticket_comments_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "itsm"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itsm"."ticket_comments" ADD CONSTRAINT "ticket_comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "iam"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itsm"."tickets" ADD CONSTRAINT "tickets_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "iam"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itsm"."tickets" ADD CONSTRAINT "tickets_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "iam"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kb"."embeddings" ADD CONSTRAINT "embeddings_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "kb"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog"."catalog_requests" ADD CONSTRAINT "catalog_requests_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "iam"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog"."catalog_requests" ADD CONSTRAINT "catalog_requests_current_approver_id_users_id_fk" FOREIGN KEY ("current_approver_id") REFERENCES "iam"."users"("id") ON DELETE no action ON UPDATE no action;