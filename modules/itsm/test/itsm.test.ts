import { describe, it, expect, beforeEach } from 'vitest';
import { ItsmService } from '../src';

describe('ITSM Service Tests', () => {
  let itsmService: ItsmService;

  beforeEach(() => {
    itsmService = new ItsmService();
  });

  it('creates ticket with formatted number and calculates SLA target', async () => {
    const ticket = await itsmService.createTicket(
      {
        title: 'Projector broken in Room 302',
        description: 'No HDMI signal display during lecture',
        facultyId: 'ENG',
        category: 'CLASSROOM',
        priority: 'CRITICAL',
        channel: 'WEB',
      },
      'usr-requester-1',
    );

    expect(ticket.ticketNumber).toMatch(/^T-\d{4}-\d{5}$/);
    expect(ticket.tier).toBe('TIER_1_FACULTY');
    expect(ticket.status).toBe('NEW');

    // SLA for CRITICAL is 2 hours
    const target = new Date(ticket.slaTargetAt).getTime();
    const created = new Date(ticket.createdAt).getTime();
    expect(target - created).toBeCloseTo(2 * 60 * 60 * 1000, -4);
  });

  it('escalates ticket from L1 to L2 central support', async () => {
    const ticket = await itsmService.createTicket(
      {
        title: 'Need Core Switch VLAN configuration',
        description: 'Special VLAN required for research lab.',
        facultyId: 'SCI',
        category: 'VPN',
        priority: 'MEDIUM',
        channel: 'WEB',
      },
      'usr-requester-2',
    );

    const escalated = await itsmService.escalateTicket(
      {
        ticketId: ticket.id,
        targetTier: 'TIER_2_CENTRAL_SUPPORT',
        reason: 'Requires central core switch configuration rights',
      },
      'faculty-tech-1',
    );

    expect(escalated.tier).toBe('TIER_2_CENTRAL_SUPPORT');
    expect(escalated.status).toBe('ASSIGNED');
  });

  it('marks ticket with suppressed incident id during major outage', async () => {
    const ticket = await itsmService.createTicket(
      {
        title: 'Cannot access REG site',
        description: 'Connection timed out',
        facultyId: 'MED',
        category: 'SOFTWARE',
        priority: 'HIGH',
        channel: 'LINE',
      },
      'student-1',
      'incident-reg-outage-01',
    );

    expect(ticket.suppressedByIncidentId).toBe('incident-reg-outage-01');
    expect(ticket.status).toBe('PENDING_VENDOR');
  });
});
