import { z } from 'zod';
import { ServiceStateSchema, IncidentImpactSchema, TicketPrioritySchema, TicketTierSchema } from './enums';

export const PasswordResetRequestedEventSchema = z.object({
  eventType: z.literal('iam.password_reset.requested'),
  userId: z.string().uuid(),
  channel: z.enum(['SMS', 'EMAIL']),
  recipient: z.string(),
  referenceCode: z.string().length(6),
  otpCode: z.string().length(6),
  timestamp: z.string(),
});
export type PasswordResetRequestedEvent = z.infer<typeof PasswordResetRequestedEventSchema>;

export const IncidentStatusChangedEventSchema = z.object({
  eventType: z.literal('incident.status_changed'),
  incidentId: z.string().uuid(),
  serviceIds: z.array(z.string().uuid()),
  impact: IncidentImpactSchema,
  serviceState: ServiceStateSchema,
  title: z.string(),
  isMajorOutage: z.boolean(),
  timestamp: z.string(),
});
export type IncidentStatusChangedEvent = z.infer<typeof IncidentStatusChangedEventSchema>;

export const TicketEscalatedEventSchema = z.object({
  eventType: z.literal('ticket.escalated'),
  ticketId: z.string().uuid(),
  ticketNumber: z.string(),
  facultyId: z.string(),
  fromTier: TicketTierSchema,
  toTier: TicketTierSchema,
  priority: TicketPrioritySchema,
  reason: z.string(),
  timestamp: z.string(),
});
export type TicketEscalatedEvent = z.infer<typeof TicketEscalatedEventSchema>;
