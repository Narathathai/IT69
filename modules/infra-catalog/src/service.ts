import crypto from 'node:crypto';
import {
  CreateCatalogRequestInput,
  CatalogRequestDetail,
  ProcessApprovalInput,
  CatalogRequestStatus,
} from '@uni-it/api-contracts';

export interface ExtendedCatalogRequest extends CatalogRequestDetail {
  approvalToken: string;
  tokenExpiresAt: string;
  approvalComment?: string;
}

export class CatalogService {
  private requests: Map<string, ExtendedCatalogRequest> = new Map();

  private validateFormData(requestType: string, formData: Record<string, unknown>): void {
    if (requestType === 'FIREWALL_RULE') {
      if (!formData['sourceIp'] || !formData['destIp'] || !formData['port']) {
        throw new Error('Firewall rule requires sourceIp, destIp, and port');
      }
    } else if (requestType === 'DNS_RECORD') {
      if (!formData['subdomain'] || !formData['targetIp']) {
        throw new Error('DNS record requires subdomain and targetIp');
      }
    } else if (requestType === 'VM_INSTANCE') {
      if (!formData['cpu'] || !formData['ram'] || !formData['os']) {
        throw new Error('VM request requires cpu, ram, and os specifications');
      }
    }
  }

  async submitRequest(
    input: CreateCatalogRequestInput,
    requesterId: string,
  ): Promise<{ request: CatalogRequestDetail; magicApprovalLink: string }> {
    this.validateFormData(input.requestType, input.formData);

    const id = crypto.randomUUID();
    const approvalToken = crypto.randomBytes(32).toString('hex');
    const now = Date.now();
    const tokenExpiresAt = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    const requestRecord: ExtendedCatalogRequest = {
      id,
      requestType: input.requestType,
      requesterId,
      status: 'PENDING_DEAN_APPROVAL',
      formData: input.formData,
      justification: input.justification,
      currentApproverId: null,
      approvedAt: null,
      approvalToken,
      tokenExpiresAt,
      createdAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
    };

    this.requests.set(id, requestRecord);

    const magicApprovalLink = `https://portal.university.ac.th/catalog/approve?token=${approvalToken}`;

    return {
      request: requestRecord,
      magicApprovalLink,
    };
  }

  async processApproval(
    input: ProcessApprovalInput,
    approverId: string,
  ): Promise<CatalogRequestDetail> {
    let matchedRequest: ExtendedCatalogRequest | null = null;

    for (const req of this.requests.values()) {
      if (req.approvalToken === input.token) {
        matchedRequest = req;
        break;
      }
    }

    if (!matchedRequest) {
      throw new Error('Invalid approval token');
    }

    if (new Date() > new Date(matchedRequest.tokenExpiresAt)) {
      throw new Error('Approval token has expired');
    }

    if (matchedRequest.status !== 'PENDING_DEAN_APPROVAL' && matchedRequest.status !== 'SUBMITTED') {
      throw new Error(`Request has already been processed with status: ${matchedRequest.status}`);
    }

    const newStatus: CatalogRequestStatus = input.decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    matchedRequest.status = newStatus;
    matchedRequest.currentApproverId = approverId;
    matchedRequest.approvedAt = input.decision === 'APPROVE' ? new Date().toISOString() : null;
    matchedRequest.approvalComment = input.comment;
    matchedRequest.updatedAt = new Date().toISOString();

    this.requests.set(matchedRequest.id, matchedRequest);
    return matchedRequest;
  }

  getRequestById(id: string): CatalogRequestDetail | undefined {
    return this.requests.get(id);
  }

  listRequestsByRequester(requesterId: string): CatalogRequestDetail[] {
    return Array.from(this.requests.values()).filter((r) => r.requesterId === requesterId);
  }
}
