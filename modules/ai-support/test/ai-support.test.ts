import { describe, it, expect, beforeEach } from 'vitest';
import { AiSupportService } from '../src';
import { StatusPageService } from '@uni-it/status-page';
import { ItsmService } from '@uni-it/itsm';

describe('AI Support Bot & Knowledge Engine Tests', () => {
  let aiService: AiSupportService;
  let statusService: StatusPageService;
  let itsmService: ItsmService;

  beforeEach(() => {
    statusService = new StatusPageService();
    itsmService = new ItsmService();
    aiService = new AiSupportService(statusService, itsmService);
  });

  it('answers eduroam Wi-Fi setup query accurately from knowledge base', async () => {
    const res = await aiService.answerQuery('ต่อ wifi eduroam ยังไงคะ');
    expect(res.isOutageDeflection).toBe(false);
    expect(res.suggestedAction).toBe('SELF_SERVE');
    expect(res.matchedArticleId).toBe('kb-01');
    expect(res.answer).toContain('eduroam');
    expect(res.confidenceScore).toBeGreaterThan(0.7);
  });

  it('directs user to SSPR when asking about forgotten password', async () => {
    const res = await aiService.answerQuery('ลืมรหัสผ่านเข้าเว็บมหาวิทยาลัยไม่ได้');
    expect(res.suggestedAction).toBe('VISIT_SSPR');
    expect(res.answer).toContain('Self-Service Password Reset');
  });

  it('deflects user queries during a major outage with status notice', async () => {
    // Declare a major outage on REG system
    await statusService.declareIncident({
      title: 'REG System Database Crash',
      impact: 'CRITICAL',
      summary: 'Main database node failure.',
      affectedServiceIds: ['svc-03'],
    });

    const res = await aiService.answerQuery('ทำไมเข้าเว็บ REG ทะเบียนไม่ได้คะ ระบบล่มหรือเปล่า');
    expect(res.isOutageDeflection).toBe(true);
    expect(res.suggestedAction).toBe('CHECK_STATUS');
    expect(res.answer).toContain('REG System Database Crash');
    expect(res.confidenceScore).toBeGreaterThan(0.9);
  });

  it('performs human handoff by creating an ITSM ticket with chat history attached', async () => {
    const chatHistory = [
      { role: 'user' as const, content: 'แล็ปคอมพิวเตอร์ห้อง 501 เปิดโปรแกรม MATLAB ไม่ได้' },
      { role: 'assistant' as const, content: 'ลองตรวจสอบ License ดูหรือยังคะ' },
      { role: 'user' as const, content: 'ลองแล้วครับขึ้น Error 105 อยากให้ช่างเข้ามาดูด่วนครับ' },
    ];

    const handoff = await aiService.requestHumanHandoff({
      messages: chatHistory,
      requesterId: 'usr-student-99',
      facultyId: 'ENG',
      category: 'SOFTWARE',
      priority: 'HIGH',
    });

    expect(handoff.ticket).toBeDefined();
    expect(handoff.ticket.ticketNumber).toMatch(/^T-\d{4}-\d{5}$/);
    expect(handoff.ticket.channel).toBe('AI_BOT');
    expect(handoff.ticket.priority).toBe('HIGH');
    expect(handoff.ticket.description).toContain('MATLAB');
    expect(handoff.handoffSummary).toContain(handoff.ticket.ticketNumber);
  });
});
