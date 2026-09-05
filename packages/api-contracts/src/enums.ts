import { z } from 'zod';

export const UserRoleSchema = z.enum([
  'STUDENT',
  'FACULTY_STAFF',
  'FACULTY_IT_L1',
  'CENTRAL_IT_L2_L3',
  'SUPER_ADMIN',
]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const AccountStatusSchema = z.enum([
  'ACTIVE',
  'LOCKED_PASSWORD_ATTEMPTS',
  'SUSPENDED_STATUS_CHANGE',
  'EXPIRED',
]);
export type AccountStatus = z.infer<typeof AccountStatusSchema>;

export const TicketPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
export type TicketPriority = z.infer<typeof TicketPrioritySchema>;

export const TicketTierSchema = z.enum([
  'TIER_1_FACULTY',
  'TIER_2_CENTRAL_SUPPORT',
  'TIER_3_SPECIALIST',
]);
export type TicketTier = z.infer<typeof TicketTierSchema>;

export const TicketStatusSchema = z.enum([
  'NEW',
  'ASSIGNED',
  'IN_PROGRESS',
  'PENDING_USER',
  'PENDING_VENDOR',
  'RESOLVED',
  'CLOSED',
]);
export type TicketStatus = z.infer<typeof TicketStatusSchema>;

export const ServiceStateSchema = z.enum([
  'OPERATIONAL',
  'DEGRADED',
  'PARTIAL_OUTAGE',
  'MAJOR_OUTAGE',
]);
export type ServiceState = z.infer<typeof ServiceStateSchema>;

export const IncidentImpactSchema = z.enum(['NONE', 'MINOR', 'MAJOR', 'CRITICAL']);
export type IncidentImpact = z.infer<typeof IncidentImpactSchema>;

export const CatalogRequestStatusSchema = z.enum([
  'SUBMITTED',
  'PENDING_DEAN_APPROVAL',
  'PENDING_IT_REVIEW',
  'APPROVED',
  'PROVISIONED',
  'REJECTED',
  'CANCELLED',
]);
export type CatalogRequestStatus = z.infer<typeof CatalogRequestStatusSchema>;
