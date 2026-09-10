CREATE TABLE `iam_otp_requests` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`otp_code_hash` varchar(64) NOT NULL,
	`channel` varchar(16) NOT NULL,
	`recipient` varchar(255) NOT NULL,
	`reference_code` varchar(10) NOT NULL,
	`attempts_left` smallint NOT NULL DEFAULT 3,
	`is_used` boolean NOT NULL DEFAULT false,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `iam_otp_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `iam_users` (
	`id` varchar(36) NOT NULL,
	`username` varchar(64) NOT NULL,
	`citizen_id_hash` varchar(64) NOT NULL,
	`full_name_th` varchar(255) NOT NULL,
	`full_name_en` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`secondary_email` varchar(255),
	`phone_number` varchar(32),
	`user_role` enum('STUDENT','FACULTY_STAFF','FACULTY_IT_L1','CENTRAL_IT_L2_L3','SUPER_ADMIN') NOT NULL DEFAULT 'STUDENT',
	`faculty_id` varchar(32) NOT NULL,
	`department_name` varchar(128),
	`account_status` enum('ACTIVE','LOCKED_PASSWORD_ATTEMPTS','SUSPENDED_STATUS_CHANGE','EXPIRED') NOT NULL DEFAULT 'ACTIVE',
	`last_sync_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `iam_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `iam_users_username_unique` UNIQUE(`username`),
	CONSTRAINT `iam_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `itsm_ticket_comments` (
	`id` varchar(36) NOT NULL,
	`ticket_id` varchar(36) NOT NULL,
	`author_id` varchar(36) NOT NULL,
	`content` text NOT NULL,
	`is_internal_note` boolean NOT NULL DEFAULT false,
	`attachments` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `itsm_ticket_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `itsm_tickets` (
	`id` varchar(36) NOT NULL,
	`ticket_number` varchar(32) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`requester_id` varchar(36) NOT NULL,
	`assigned_to_id` varchar(36),
	`faculty_id` varchar(32) NOT NULL,
	`category` varchar(64) NOT NULL,
	`ticket_priority` enum('LOW','MEDIUM','HIGH','CRITICAL') NOT NULL DEFAULT 'MEDIUM',
	`ticket_tier` enum('TIER_1_FACULTY','TIER_2_CENTRAL_SUPPORT','TIER_3_SPECIALIST') NOT NULL DEFAULT 'TIER_1_FACULTY',
	`ticket_status` enum('NEW','ASSIGNED','IN_PROGRESS','PENDING_USER','PENDING_VENDOR','RESOLVED','CLOSED') NOT NULL DEFAULT 'NEW',
	`channel` varchar(32) NOT NULL DEFAULT 'WEB',
	`sla_target_at` timestamp NOT NULL,
	`resolved_at` timestamp,
	`suppressed_by_incident_id` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `itsm_tickets_id` PRIMARY KEY(`id`),
	CONSTRAINT `itsm_tickets_ticket_number_unique` UNIQUE(`ticket_number`)
);
--> statement-breakpoint
CREATE TABLE `status_incidents` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`incident_impact` enum('NONE','MINOR','MAJOR','CRITICAL') NOT NULL DEFAULT 'MINOR',
	`summary` text NOT NULL,
	`affected_service_ids` json NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`started_at` timestamp NOT NULL DEFAULT (now()),
	`resolved_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `status_incidents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `status_services` (
	`id` varchar(36) NOT NULL,
	`name` varchar(128) NOT NULL,
	`description` varchar(255),
	`category` varchar(64) NOT NULL,
	`service_state` enum('OPERATIONAL','DEGRADED','PARTIAL_OUTAGE','MAJOR_OUTAGE') NOT NULL DEFAULT 'OPERATIONAL',
	`display_order` int NOT NULL DEFAULT 0,
	`probe_url` varchar(512),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `status_services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kb_articles` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`category` varchar(64) NOT NULL,
	`content_markdown` text NOT NULL,
	`is_published` boolean NOT NULL DEFAULT true,
	`view_count` int NOT NULL DEFAULT 0,
	`helpful_votes` int NOT NULL DEFAULT 0,
	`unhelpful_votes` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `kb_articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `kb_articles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `kb_embeddings` (
	`id` varchar(36) NOT NULL,
	`article_id` varchar(36) NOT NULL,
	`chunk_index` int NOT NULL,
	`chunk_content` text NOT NULL,
	`embedding` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `kb_embeddings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `catalog_requests` (
	`id` varchar(36) NOT NULL,
	`request_type` varchar(64) NOT NULL,
	`requester_id` varchar(36) NOT NULL,
	`catalog_request_status` enum('SUBMITTED','PENDING_DEAN_APPROVAL','PENDING_IT_REVIEW','APPROVED','PROVISIONED','REJECTED','CANCELLED') NOT NULL DEFAULT 'SUBMITTED',
	`form_data` json NOT NULL,
	`justification` text NOT NULL,
	`current_approver_id` varchar(36),
	`approval_token` varchar(128),
	`token_expires_at` timestamp,
	`approved_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `catalog_requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `catalog_requests_approval_token_unique` UNIQUE(`approval_token`)
);
--> statement-breakpoint
CREATE TABLE `audit_system_logs` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36),
	`ip_address` varchar(64) NOT NULL,
	`user_agent` text,
	`action_type` varchar(64) NOT NULL,
	`resource_type` varchar(64) NOT NULL,
	`resource_id` varchar(64),
	`payload` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_system_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `iam_otp_requests` ADD CONSTRAINT `iam_otp_requests_user_id_iam_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `iam_users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `itsm_ticket_comments` ADD CONSTRAINT `itsm_ticket_comments_ticket_id_itsm_tickets_id_fk` FOREIGN KEY (`ticket_id`) REFERENCES `itsm_tickets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `itsm_ticket_comments` ADD CONSTRAINT `itsm_ticket_comments_author_id_iam_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `iam_users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `itsm_tickets` ADD CONSTRAINT `itsm_tickets_requester_id_iam_users_id_fk` FOREIGN KEY (`requester_id`) REFERENCES `iam_users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `itsm_tickets` ADD CONSTRAINT `itsm_tickets_assigned_to_id_iam_users_id_fk` FOREIGN KEY (`assigned_to_id`) REFERENCES `iam_users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `kb_embeddings` ADD CONSTRAINT `kb_embeddings_article_id_kb_articles_id_fk` FOREIGN KEY (`article_id`) REFERENCES `kb_articles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `catalog_requests` ADD CONSTRAINT `catalog_requests_requester_id_iam_users_id_fk` FOREIGN KEY (`requester_id`) REFERENCES `iam_users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `catalog_requests` ADD CONSTRAINT `catalog_requests_current_approver_id_iam_users_id_fk` FOREIGN KEY (`current_approver_id`) REFERENCES `iam_users`(`id`) ON DELETE no action ON UPDATE no action;