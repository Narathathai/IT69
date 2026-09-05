import { z } from 'zod';
import { TicketPrioritySchema, TicketTierSchema, TicketStatusSchema } from './enums';

export const CreateTicketInputSchema = z.object({
  title: z.string().min(5).max(255),
  description: z.string().min(10),
  facultyId: z.string().min(1),
  category: z.enum(['WIFI', 'VPN', 'EMAIL', 'HARDWARE', 'SOFTWARE', 'CLASSROOM', 'OTHER']),
  priority: TicketPrioritySchema.default('MEDIUM'),
  channel: z.enum(['WEB', 'LINE', 'EMAIL', 'AI_BOT']).default('WEB'),
  clientDiagnostics: z
    .object({
      ipAddress: z.string().optional(),
      userAgent: z.string().optional(),
      location: z.string().optional(),
    })
    .optional(),
});
export type CreateTicketInput = z.infer<typeof CreateTicketInputSchema>;

export const EscalateTicketInputSchema = z.object({
  ticketId: z.string().uuid(),
  targetTier: TicketTierSchema,
  reason: z.string().min(5),
  internalNote: z.string().optional(),
});
export type EscalateTicketInput = z.infer<typeof EscalateTicketInputSchema>;

export const AddTicketCommentInputSchema = z.object({
  ticketId: z.string().uuid(),
  content: z.string().min(1),
  isInternalNote: z.boolean().default(false),
  attachments: z.array(z.string().url()).default([]),
});
export type AddTicketCommentInput = z.infer<typeof AddTicketCommentInputSchema>;

export const TicketDetailSchema = z.object({
  id: z.string().uuid(),
  ticketNumber: z.string(),
  title: z.string(),
  description: z.string(),
  requesterId: z.string().uuid(),
  assignedToId: z.string().uuid().nullable(),
  facultyId: z.string(),
  category: z.string(),
  priority: TicketPrioritySchema,
  tier: TicketTierSchema,
  status: TicketStatusSchema,
  channel: z.string(),
  slaTargetAt: z.string(),
  resolvedAt: z.string().nullable(),
  suppressedByIncidentId: z.string().uuid().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type TicketDetail = z.infer<typeof TicketDetailSchema>;
