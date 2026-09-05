import crypto from 'node:crypto';
import {
  CreateTicketInput,
  TicketDetail,
  EscalateTicketInput,
  TicketPriority,
  TicketTier,
  TicketStatus,
} from '@uni-it/api-contracts';

export class ItsmService {
  private tickets: Map<string, TicketDetail> = new Map();
  private ticketSequence = 1;

  private generateTicketNumber(): string {
    const year = new Date().getFullYear();
    const seq = String(this.ticketSequence++).padStart(5, '0');
    return `T-${year}-${seq}`;
  }

  private calculateSlaTarget(priority: TicketPriority): Date {
    const now = Date.now();
    let hours = 8; // Default MEDIUM
    if (priority === 'CRITICAL') hours = 2;
    else if (priority === 'HIGH') hours = 4;
    else if (priority === 'LOW') hours = 24;

    return new Date(now + hours * 60 * 60 * 1000);
  }

  async createTicket(
    input: CreateTicketInput,
    requesterId: string,
    activeOutageIncidentId?: string | null,
  ): Promise<TicketDetail> {
    const id = crypto.randomUUID();
    const ticketNumber = this.generateTicketNumber();
    const slaTarget = this.calculateSlaTarget(input.priority);
    const nowStr = new Date().toISOString();

    const ticket: TicketDetail = {
      id,
      ticketNumber,
      title: input.title,
      description: input.description,
      requesterId,
      assignedToId: null,
      facultyId: input.facultyId,
      category: input.category,
      priority: input.priority,
      tier: 'TIER_1_FACULTY',
      status: activeOutageIncidentId ? 'PENDING_VENDOR' : 'NEW',
      channel: input.channel,
      slaTargetAt: slaTarget.toISOString(),
      resolvedAt: null,
      suppressedByIncidentId: activeOutageIncidentId ?? null,
      createdAt: nowStr,
      updatedAt: nowStr,
    };

    this.tickets.set(id, ticket);
    return ticket;
  }

  async escalateTicket(input: EscalateTicketInput, operatorId: string): Promise<TicketDetail> {
    const ticket = this.tickets.get(input.ticketId);
    if (!ticket) {
      throw new Error(`Ticket not found: ${input.ticketId}`);
    }

    if (ticket.status === 'CLOSED' || ticket.status === 'RESOLVED') {
      throw new Error('Cannot escalate a resolved or closed ticket');
    }

    ticket.tier = input.targetTier;
    ticket.status = 'ASSIGNED';
    ticket.updatedAt = new Date().toISOString();

    this.tickets.set(ticket.id, ticket);
    return ticket;
  }

  async resolveTicket(ticketId: string): Promise<TicketDetail> {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) {
      throw new Error(`Ticket not found: ${ticketId}`);
    }

    ticket.status = 'RESOLVED';
    ticket.resolvedAt = new Date().toISOString();
    ticket.updatedAt = new Date().toISOString();

    this.tickets.set(ticket.id, ticket);
    return ticket;
  }

  getTicketById(ticketId: string): TicketDetail | undefined {
    return this.tickets.get(ticketId);
  }

  listTicketsByFaculty(facultyId: string): TicketDetail[] {
    return Array.from(this.tickets.values()).filter((t) => t.facultyId === facultyId);
  }
}
