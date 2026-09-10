import { db, poolConnection } from './client';
import { services, users } from './schema/mysql';

async function seed() {
  console.log('Seeding initial data into MySQL (uni_it_hub)...');

  // Insert default services
  const defaultServices = [
    { id: 'svc-01', name: 'Campus Wi-Fi & eduroam', category: 'NETWORK', currentState: 'OPERATIONAL' as const, displayOrder: 1 },
    { id: 'svc-02', name: 'Campus Virtual Private Network (VPN)', category: 'NETWORK', currentState: 'OPERATIONAL' as const, displayOrder: 2 },
    { id: 'svc-03', name: 'Student Information System (REG)', category: 'ACADEMIC_SYS', currentState: 'OPERATIONAL' as const, displayOrder: 3 },
    { id: 'svc-04', name: 'Learning Management System (LMS)', category: 'ACADEMIC_SYS', currentState: 'OPERATIONAL' as const, displayOrder: 4 },
    { id: 'svc-05', name: 'University Microsoft 365 & Email', category: 'OFFICE_APP', currentState: 'OPERATIONAL' as const, displayOrder: 5 },
  ];

  for (const svc of defaultServices) {
    await db
      .insert(services)
      .values(svc)
      .onDuplicateKeyUpdate({ set: { name: svc.name, currentState: svc.currentState } });
  }

  // Insert default test user
  await db
    .insert(users)
    .values({
      id: 'usr-001',
      username: 'u6510001',
      citizenIdHash: '1234',
      fullNameTh: 'สมชาย รักเรียน',
      fullNameEn: 'Somchai Rakrian',
      email: 'u6510001@university.ac.th',
      phoneNumber: '0812345678',
      role: 'STUDENT',
      facultyId: 'ENG',
      departmentName: 'Computer Engineering',
      accountStatus: 'ACTIVE',
    })
    .onDuplicateKeyUpdate({ set: { fullNameTh: 'สมชาย รักเรียน' } });

  console.log('Seeding completed successfully!');
  await poolConnection.end();
}

seed().catch((err: unknown) => {
  console.error('Failed to seed MySQL:', err);
  process.exit(1);
});
