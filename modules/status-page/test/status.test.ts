import { describe, it, expect, beforeEach } from 'vitest';
import { StatusPageService } from '../src';

describe('Status Page & Outage Notifier Tests', () => {
  let statusService: StatusPageService;

  beforeEach(() => {
    statusService = new StatusPageService();
  });

  it('initializes with all default services operational', async () => {
    const overview = await statusService.getPublicStatusOverview();
    expect(overview.systemState).toBe('OPERATIONAL');
    expect(overview.services.length).toBe(5);
    expect(overview.activeIncidents.length).toBe(0);
  });

  it('declares an incident and automatically updates affected service state', async () => {
    const incident = await statusService.declareIncident({
      title: 'REG Registration Database Network Slowness',
      impact: 'MAJOR',
      summary: 'Students are experiencing connection timeouts during enrollment.',
      affectedServiceIds: ['svc-03'],
    });

    expect(incident.isActive).toBe(true);

    const overview = await statusService.getPublicStatusOverview();
    expect(overview.systemState).toBe('MAJOR_OUTAGE');
    expect(overview.bannerMessage).toContain('REG Registration Database');

    const regService = overview.services.find((s) => s.id === 'svc-03');
    expect(regService?.currentState).toBe('MAJOR_OUTAGE');

    // Test ticket suppression helper
    expect(statusService.isServiceUnderMajorOutage('svc-03')).toBe(true);
  });

  it('resolves incident and restores service state to operational', async () => {
    const incident = await statusService.declareIncident({
      title: 'Eduroam AP firmware failure',
      impact: 'CRITICAL',
      summary: 'Core switch rebooting.',
      affectedServiceIds: ['svc-01'],
    });

    await statusService.resolveIncident(incident.id);

    const overview = await statusService.getPublicStatusOverview();
    expect(overview.systemState).toBe('OPERATIONAL');

    const wifiService = overview.services.find((s) => s.id === 'svc-01');
    expect(wifiService?.currentState).toBe('OPERATIONAL');
  });

  it('evaluates synthetic probe failure and marks service as degraded', async () => {
    await statusService.evaluateProbeResult({
      serviceId: 'svc-02',
      probeUrl: 'https://vpn.university.ac.th/health',
      isHealthy: false,
      responseTimeMs: 5200,
      statusCode: 504,
      errorMessage: 'Gateway Timeout',
      checkedAt: new Date().toISOString(),
    });

    const overview = await statusService.getPublicStatusOverview();
    const vpnService = overview.services.find((s) => s.id === 'svc-02');
    expect(vpnService?.currentState).toBe('DEGRADED');
  });
});
