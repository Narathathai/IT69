import {
  ServiceItem,
  IncidentItem,
  PublicStatusOverview,
  SyntheticProbeResult,
  ServiceState,
  IncidentImpact,
} from '@uni-it/api-contracts';

export class StatusPageService {
  private services: Map<string, ServiceItem> = new Map();
  private incidents: Map<string, IncidentItem> = new Map();

  constructor() {
    this.seedDefaultServices();
  }

  private seedDefaultServices(): void {
    const defaultServices: Array<{ id: string; name: string; category: string; displayOrder: number }> = [
      { id: 'svc-01', name: 'Campus Wi-Fi & eduroam', category: 'NETWORK', displayOrder: 1 },
      { id: 'svc-02', name: 'Campus Virtual Private Network (VPN)', category: 'NETWORK', displayOrder: 2 },
      { id: 'svc-03', name: 'Student Information System (REG)', category: 'ACADEMIC_SYS', displayOrder: 3 },
      { id: 'svc-04', name: 'Learning Management System (LMS)', category: 'ACADEMIC_SYS', displayOrder: 4 },
      { id: 'svc-05', name: 'University Microsoft 365 & Email', category: 'OFFICE_APP', displayOrder: 5 },
    ];

    for (const svc of defaultServices) {
      this.services.set(svc.id, {
        id: svc.id,
        name: svc.name,
        category: svc.category,
        currentState: 'OPERATIONAL',
        displayOrder: svc.displayOrder,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  async getPublicStatusOverview(): Promise<PublicStatusOverview> {
    const serviceList = Array.from(this.services.values()).sort(
      (a, b) => a.displayOrder - b.displayOrder,
    );
    const activeIncidents = Array.from(this.incidents.values()).filter((inc) => inc.isActive);

    // Derive overall system state:
    // If any service is MAJOR_OUTAGE -> MAJOR_OUTAGE
    // Else if any is PARTIAL_OUTAGE or DEGRADED -> DEGRADED
    // Else OPERATIONAL
    let systemState: ServiceState = 'OPERATIONAL';
    const states = serviceList.map((s) => s.currentState);
    if (states.includes('MAJOR_OUTAGE')) {
      systemState = 'MAJOR_OUTAGE';
    } else if (states.includes('PARTIAL_OUTAGE') || states.includes('DEGRADED')) {
      systemState = 'DEGRADED';
    }

    const bannerMessage =
      activeIncidents.length > 0
        ? `Notice: ${activeIncidents[0]?.title} is currently under investigation.`
        : null;

    return {
      systemState,
      lastUpdated: new Date().toISOString(),
      services: serviceList,
      activeIncidents,
      bannerMessage,
    };
  }

  async updateServiceState(serviceId: string, newState: ServiceState): Promise<ServiceItem> {
    const svc = this.services.get(serviceId);
    if (!svc) {
      throw new Error(`Service not found: ${serviceId}`);
    }

    svc.currentState = newState;
    svc.updatedAt = new Date().toISOString();
    this.services.set(serviceId, svc);
    return svc;
  }

  async declareIncident(params: {
    title: string;
    impact: IncidentImpact;
    summary: string;
    affectedServiceIds: string[];
  }): Promise<IncidentItem> {
    const id = `inc-${Date.now()}`;
    const incident: IncidentItem = {
      id,
      title: params.title,
      impact: params.impact,
      summary: params.summary,
      affectedServiceIds: params.affectedServiceIds,
      isActive: true,
      startedAt: new Date().toISOString(),
      resolvedAt: null,
      createdAt: new Date().toISOString(),
    };

    this.incidents.set(id, incident);

    // Auto-degrade affected services
    const targetState: ServiceState =
      params.impact === 'CRITICAL' || params.impact === 'MAJOR' ? 'MAJOR_OUTAGE' : 'DEGRADED';

    for (const serviceId of params.affectedServiceIds) {
      if (this.services.has(serviceId)) {
        await this.updateServiceState(serviceId, targetState);
      }
    }

    return incident;
  }

  async resolveIncident(incidentId: string): Promise<IncidentItem> {
    const inc = this.incidents.get(incidentId);
    if (!inc) {
      throw new Error(`Incident not found: ${incidentId}`);
    }

    inc.isActive = false;
    inc.resolvedAt = new Date().toISOString();
    this.incidents.set(incidentId, inc);

    // Restore affected services to OPERATIONAL if no other active incident affects them
    for (const serviceId of inc.affectedServiceIds) {
      const otherActive = Array.from(this.incidents.values()).some(
        (i) => i.isActive && i.affectedServiceIds.includes(serviceId),
      );
      if (!otherActive && this.services.has(serviceId)) {
        await this.updateServiceState(serviceId, 'OPERATIONAL');
      }
    }

    return inc;
  }

  isServiceUnderMajorOutage(serviceId: string): boolean {
    const svc = this.services.get(serviceId);
    return svc?.currentState === 'MAJOR_OUTAGE';
  }

  async evaluateProbeResult(result: SyntheticProbeResult): Promise<void> {
    const newState: ServiceState = result.isHealthy ? 'OPERATIONAL' : 'DEGRADED';
    if (this.services.has(result.serviceId)) {
      await this.updateServiceState(result.serviceId, newState);
    }
  }
}
