import { z } from 'zod';
import { CatalogRequestStatusSchema } from './enums';

export const CreateCatalogRequestInputSchema = z.object({
  requestType: z.enum(['FIREWALL_RULE', 'DNS_RECORD', 'VM_INSTANCE', 'SOFTWARE_LICENSE']),
  justification: z.string().min(10),
  formData: z.record(z.unknown()), // validated with specific subtype downstream
  approverEmail: z.string().email(),
});
export type CreateCatalogRequestInput = z.infer<typeof CreateCatalogRequestInputSchema>;

export const ProcessApprovalInputSchema = z.object({
  token: z.string().min(32),
  decision: z.enum(['APPROVE', 'REJECT']),
  comment: z.string().optional(),
});
export type ProcessApprovalInput = z.infer<typeof ProcessApprovalInputSchema>;

export const CatalogRequestDetailSchema = z.object({
  id: z.string().uuid(),
  requestType: z.string(),
  requesterId: z.string().uuid(),
  status: CatalogRequestStatusSchema,
  formData: z.record(z.unknown()),
  justification: z.string(),
  currentApproverId: z.string().uuid().nullable().optional(),
  approvedAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type CatalogRequestDetail = z.infer<typeof CatalogRequestDetailSchema>;
