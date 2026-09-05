import { UserProfile } from '@uni-it/api-contracts';

export interface LdapUserRecord {
  username: string;
  citizenIdLast4: string;
  fullNameTh: string;
  fullNameEn: string;
  email: string;
  phoneNumber: string;
  facultyId: string;
  isLocked: boolean;
}

// In-memory mock directory representing central LDAP / SIS snapshot
const MOCK_CENTRAL_DIRECTORY: Map<string, LdapUserRecord> = new Map([
  [
    'u6510001',
    {
      username: 'u6510001',
      citizenIdLast4: '1234',
      fullNameTh: 'สมชาย รักเรียน',
      fullNameEn: 'Somchai Rakrian',
      email: 'u6510001@university.ac.th',
      phoneNumber: '0812345678',
      facultyId: 'ENG',
      isLocked: false,
    },
  ],
  [
    'u6510002',
    {
      username: 'u6510002',
      citizenIdLast4: '5678',
      fullNameTh: 'สมหญิง จริงใจ',
      fullNameEn: 'Somying Jingjai',
      email: 'u6510002@university.ac.th',
      phoneNumber: '0898765432',
      facultyId: 'SCI',
      isLocked: true,
    },
  ],
]);

export class UniversityDirectoryAdapter {
  private failureCount = 0;
  private isCircuitOpen = false;

  async findUserByUsername(username: string): Promise<LdapUserRecord | null> {
    if (this.isCircuitOpen) {
      // Degraded fallback to shadow cache
      return MOCK_CENTRAL_DIRECTORY.get(username) ?? null;
    }

    try {
      const user = MOCK_CENTRAL_DIRECTORY.get(username);
      this.failureCount = 0;
      return user ?? null;
    } catch {
      this.failureCount++;
      if (this.failureCount >= 5) {
        this.isCircuitOpen = true;
      }
      return null;
    }
  }

  async syncPasswordToLdap(username: string, _newPasswordHash: string): Promise<boolean> {
    const user = MOCK_CENTRAL_DIRECTORY.get(username);
    if (!user) {
      return false;
    }
    user.isLocked = false;
    return true;
  }
}
