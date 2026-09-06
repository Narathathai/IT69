import { describe, it, expect, beforeEach } from 'vitest';
import { CatalogService } from '../src';

describe('Digital Infrastructure Catalog & Approval Tests', () => {
  let catalogService: CatalogService;

  beforeEach(() => {
    catalogService = new CatalogService();
  });

  it('submits a valid firewall rule request and returns a secure magic approval link', async () => {
    const res = await catalogService.submitRequest(
      {
        requestType: 'FIREWALL_RULE',
        justification: 'Open port 443 for AI laboratory web server',
        approverEmail: 'dean@eng.university.ac.th',
        formData: {
          sourceIp: '10.20.30.0/24',
          destIp: '192.168.1.50',
          port: 443,
          protocol: 'TCP',
        },
      },
      'researcher-prof-somchai',
    );

    expect(res.request.status).toBe('PENDING_DEAN_APPROVAL');
    expect(res.magicApprovalLink).toContain('token=');
  });

  it('rejects invalid request when required form fields are missing', async () => {
    await expect(
      catalogService.submitRequest(
        {
          requestType: 'FIREWALL_RULE',
          justification: 'Incomplete request',
          approverEmail: 'dean@eng.university.ac.th',
          formData: {
            sourceIp: '10.20.30.0/24',
            // Missing destIp and port!
          },
        },
        'user-1',
      ),
    ).rejects.toThrow('Firewall rule requires sourceIp, destIp, and port');
  });

  it('processes 1-click magic link approval successfully', async () => {
    const submitted = await catalogService.submitRequest(
      {
        requestType: 'DNS_RECORD',
        justification: 'Subdomain for faculty international conference',
        approverEmail: 'dean@sci.university.ac.th',
        formData: {
          subdomain: 'icset2026.sci.university.ac.th',
          targetIp: '203.144.12.34',
        },
      },
      'prof-sc-01',
    );

    // Extract token from link
    const url = new URL(submitted.magicApprovalLink);
    const token = url.searchParams.get('token')!;
    expect(token).toBeDefined();

    // Dean clicks "APPROVE"
    const approved = await catalogService.processApproval(
      {
        token,
        decision: 'APPROVE',
        comment: 'Approved for the duration of the conference.',
      },
      'dean-user-id',
    );

    expect(approved.status).toBe('APPROVED');
    expect(approved.approvedAt).toBeDefined();
    expect(approved.currentApproverId).toBe('dean-user-id');
  });

  it('throws error when trying to reuse or approve already processed token', async () => {
    const submitted = await catalogService.submitRequest(
      {
        requestType: 'VM_INSTANCE',
        justification: 'Deep Learning research sandbox',
        approverEmail: 'dean@eng.university.ac.th',
        formData: {
          cpu: 8,
          ram: '32GB',
          os: 'Ubuntu 24.04 LTS',
        },
      },
      'researcher-02',
    );

    const token = new URL(submitted.magicApprovalLink).searchParams.get('token')!;

    // First approval
    await catalogService.processApproval({ token, decision: 'APPROVE' }, 'dean-id');

    // Second attempt should throw
    await expect(
      catalogService.processApproval({ token, decision: 'REJECT' }, 'dean-id'),
    ).rejects.toThrow('Request has already been processed');
  });
});
