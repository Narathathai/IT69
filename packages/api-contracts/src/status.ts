import { z } from 'zod';
import { ServiceStateSchema, IncidentImpactSchema } from './enums';

export const ServiceItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  category: z.string(),
  currentState: ServiceStateSchema,
  displayOrder: z.number().int(),
  updatedAt: z.string(),
});
export type ServiceItem = z.infer<typeof ServiceItemSchema>;

export const IncidentItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  impact: IncidentImpactSchema,
  summary: z.string(),
  affectedServiceIds: z.array(z.string().uuid()),
  isActive: z.boolean(),
  startedAt: z.string(),
  resolvedAt: z.string().nullable(),
  createdAt: z.string(),
});
export type IncidentItem = z.infer<typeof IncidentItemSchema>;

export const PublicStatusOverviewSchema = z.object({
  systemState: ServiceStateSchema,
  lastUpdated: z.string(),
  services: z.array(ServiceItemSchema),
  activeIncidents: z.array(IncidentItemSchema),
  bannerMessage: z.string().nullable().optional(),
});
export type PublicStatusOverview = z.infer<typeof PublicStatusOverviewSchema>;

export const SyntheticProbeResultSchema = z.object({
  serviceId: z.string().uuid(),
  probeUrl: z.string().url(),
  isHealthy: z.boolean(),
  responseTimeMs: z.number(),
  statusCode: z.number().optional(),
  errorMessage: z.string().nullable().optional(),
  checkedAt: z.string(),
});
export type SyntheticProbeResult = z.infer<typeof SyntheticProbeResultSchema>;
