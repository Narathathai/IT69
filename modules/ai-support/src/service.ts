import { ItsmService } from '@uni-it/itsm';
import { StatusPageService } from '@uni-it/status-page';
import { TicketDetail, TicketPriority } from '@uni-it/api-contracts';
import { UNIVERSITY_KB, KbArticle } from './knowledge-base';

export interface AiAnswerResponse {
  answer: string;
  matchedArticleId: string | null;
  confidenceScore: number;
  isOutageDeflection: boolean;
  suggestedAction: 'SELF_SERVE' | 'VISIT_SSPR' | 'CHECK_STATUS' | 'OPEN_TICKET';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class AiSupportService {
  private kb: KbArticle[] = UNIVERSITY_KB;
  private statusService: StatusPageService;
  private itsmService: ItsmService;

  constructor(statusService = new StatusPageService(), itsmService = new ItsmService()) {
    this.statusService = statusService;
    this.itsmService = itsmService;
  }

  async answerQuery(
    query: string,
    _context: { facultyId?: string } = {},
  ): Promise<AiAnswerResponse> {
    const lowerQuery = query.toLowerCase().trim();

    // 1. Check for Major Outage Deflection
    const statusOverview = await this.statusService.getPublicStatusOverview();
    if (statusOverview.systemState === 'MAJOR_OUTAGE' && statusOverview.activeIncidents.length > 0) {
      const activeInc = statusOverview.activeIncidents[0];
      if (
        lowerQuery.includes('ล่ม') ||
        lowerQuery.includes('เข้าไม่ได้') ||
        lowerQuery.includes('reg') ||
        lowerQuery.includes('ทะเบียน') ||
        lowerQuery.includes('เน็ต') ||
        lowerQuery.includes('wifi')
      ) {
        return {
          answer: `ขณะนี้ระบบ "${activeInc?.title}" กำลังมีเหตุขัดข้องชั่วคราว ทางวิศวกรไอทีกำลังเร่งแก้ไข คาดว่าจะกลับมาใช้งานได้ตามปกติเร็วๆ นี้ ขออภัยในความไม่สะดวกค่ะ (คุณไม่จำเป็นต้องรีเซ็ตรหัสผ่านหรือเปิดคำร้องซ้ำ)`,
          matchedArticleId: null,
          confidenceScore: 0.98,
          isOutageDeflection: true,
          suggestedAction: 'CHECK_STATUS',
        };
      }
    }

    // 2. Check for Password / SSPR Intent
    if (
      lowerQuery.includes('ลืมรหัส') ||
      lowerQuery.includes('เปลี่ยนรหัส') ||
      lowerQuery.includes('password') ||
      lowerQuery.includes('ล็อก') ||
      lowerQuery.includes('เข้าไม่ได้')
    ) {
      return {
        answer:
          'หากคุณลืมรหัสผ่านหรือบัญชีถูกล็อก สามารถใช้งานระบบ Self-Service Password Reset (SSPR) เพื่อขอรับรหัส OTP ทางเบอร์มือถือและตั้งรหัสผ่านใหม่ได้ทันทีตลอด 24 ชั่วโมง โดยไม่ต้องรอเจ้าหน้าที่ค่ะ',
        matchedArticleId: 'sspr-service',
        confidenceScore: 0.95,
        isOutageDeflection: false,
        suggestedAction: 'VISIT_SSPR',
      };
    }

    // 3. Match against University Knowledge Base
    let bestMatch: KbArticle | null = null;
    let highestScore = 0;

    for (const article of this.kb) {
      let score = 0;
      for (const kw of article.keywords) {
        if (lowerQuery.includes(kw)) {
          score += 1;
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = article;
      }
    }

    if (bestMatch && highestScore > 0) {
      const confidence = Math.min(0.7 + highestScore * 0.1, 0.95);
      const answer = `【${bestMatch.title}】\n${bestMatch.summary}\n\nขั้นตอนการปฏิบัติ:\n${bestMatch.content}`;
      return {
        answer,
        matchedArticleId: bestMatch.id,
        confidenceScore: confidence,
        isOutageDeflection: false,
        suggestedAction: 'SELF_SERVE',
      };
    }

    // 4. Fallback if no relevant article found
    return {
      answer:
        'ขออภัยค่ะ ระบบยังไม่พบข้อมูลที่ตรงกับคำถามของคุณโดยตรง คุณต้องการให้ระบบส่งเรื่องต่อให้เจ้าหน้าที่ไอที (Human Handoff) เปิด Ticket เพื่อเข้ามาช่วยเหลือหรือไม่คะ?',
      matchedArticleId: null,
      confidenceScore: 0.3,
      isOutageDeflection: false,
      suggestedAction: 'OPEN_TICKET',
    };
  }

  async requestHumanHandoff(params: {
    messages: ChatMessage[];
    requesterId: string;
    facultyId: string;
    category?: string;
    priority?: TicketPriority;
  }): Promise<{ ticket: TicketDetail; handoffSummary: string }> {
    const userMessages = params.messages
      .filter((m) => m.role === 'user')
      .map((m) => m.content)
      .join(' | ');

    const title = `[AI Handoff] คำร้องสอบถามจากแชตบอต (${params.category || 'OTHER'})`;
    const description = `บทสนทนากับ AI Support Bot:\n${params.messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n')}\n\nสรุปประเด็นผู้ใช้: ${userMessages}`;

    const validCategories = ['WIFI', 'VPN', 'EMAIL', 'HARDWARE', 'SOFTWARE', 'CLASSROOM', 'OTHER'] as const;
    type ValidCategory = (typeof validCategories)[number];
    const category: ValidCategory = validCategories.includes(params.category as ValidCategory)
      ? (params.category as ValidCategory)
      : 'OTHER';

    const ticket = await this.itsmService.createTicket(
      {
        title,
        description,
        facultyId: params.facultyId,
        category,
        priority: params.priority || 'MEDIUM',
        channel: 'AI_BOT',
      },
      params.requesterId,
    );

    const handoffSummary = `ส่งเรื่องให้เจ้าหน้าที่เรียบร้อยแล้วค่ะ เลขที่คำร้องของคุณคือ ${ticket.ticketNumber} โดยเจ้าหน้าที่จะติดต่อกลับตามเวลาเป้าหมาย SLA ภายใน 8 ชั่วโมงค่ะ`;

    return {
      ticket,
      handoffSummary,
    };
  }
}
