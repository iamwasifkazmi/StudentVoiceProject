import 'dotenv/config';
import { PrismaClient, FeedbackStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const MODULES = [
  {
    code: 'CO7100',
    name: 'Research Dissertation',
    lecturerName: 'Dr Stuart Cunningham',
    colourHex: '#7C3AED',
    department: 'Computer Science',
  },
  {
    code: 'CO6050',
    name: 'Human-Computer Interaction',
    lecturerName: 'Dr Sarah Jones',
    colourHex: '#22C55E',
    department: 'Computer Science',
  },
  {
    code: 'CO6030',
    name: 'Software Development',
    lecturerName: 'Dr Mark Taylor',
    colourHex: '#EF4444',
    department: 'Computer Science',
  },
  {
    code: 'CO6080',
    name: 'Cloud Computing',
    lecturerName: 'Dr Amy Brown',
    colourHex: '#3B82F6',
    department: 'Computer Science',
  },
  {
    code: 'CO6070',
    name: 'Data Science',
    lecturerName: 'Dr James Wilson',
    colourHex: '#F97316',
    department: 'Computer Science',
  },
  {
    code: 'CO6090',
    name: 'Cyber Security',
    lecturerName: 'Dr Emma Clark',
    colourHex: '#14B8A6',
    department: 'Computer Science',
  },
] as const;

async function main() {
  console.log('Seeding modules...');
  for (const m of MODULES) {
    await prisma.module.upsert({
      where: { code: m.code },
      update: {
        name: m.name,
        lecturerName: m.lecturerName,
        colourHex: m.colourHex,
        department: m.department,
      },
      create: { ...m },
    });
  }

  const modMap = Object.fromEntries(
    (await prisma.module.findMany()).map(x => [x.code, x.id]),
  ) as Record<string, string>;

  console.log('Seeding impact entries...');
  const impacts = [
    {
      code: 'CO7100',
      youSaid: 'Lecture recordings were uploaded too late for revision.',
      weDid: 'Recordings now uploaded within 24 hours.',
      studentCount: 47,
    },
    {
      code: 'CO6050',
      youSaid: 'Assignment briefs were unclear about word count.',
      weDid: 'All briefs now include a standardised requirements checklist.',
      studentCount: 31,
    },
    {
      code: 'CO6030',
      youSaid: 'Not enough practical coding exercises.',
      weDid: 'Added 2 additional hands-on labs per module.',
      studentCount: 53,
    },
  ] as const;

  for (const row of impacts) {
    const moduleId = modMap[row.code];
    const existing = await prisma.impactEntry.findFirst({
      where: { moduleId, youSaid: row.youSaid },
    });
    if (existing) {
      await prisma.impactEntry.update({
        where: { id: existing.id },
        data: {
          weDid: row.weDid,
          studentCount: row.studentCount,
        },
      });
    } else {
      await prisma.impactEntry.create({
        data: {
          moduleId,
          youSaid: row.youSaid,
          weDid: row.weDid,
          studentCount: row.studentCount,
        },
      });
    }
  }

  console.log('Seeding demo user...');
  const passwordHash = await bcrypt.hash('Password123', 10);
  const demo = await prisma.user.upsert({
    where: { email: 'student@chester.ac.uk' },
    update: {
      fullName: 'Demo Student',
      studentId: '2430001',
      passwordHash,
    },
    create: {
      fullName: 'Demo Student',
      email: 'student@chester.ac.uk',
      studentId: '2430001',
      passwordHash,
      notificationPrefs: { push: true, email: true, inApp: true },
    },
  });

  console.log('Seeding sample feedback + notifications...');
  await prisma.feedback.deleteMany({ where: { userId: demo.id } });
  await prisma.notification.deleteMany({ where: { userId: demo.id } });

  const fb1 = await prisma.feedback.create({
    data: {
      userId: demo.id,
      moduleId: modMap['CO7100'],
      rating: 4,
      comment: 'Assignment briefs were unclear about word count expectations.',
      status: FeedbackStatus.received,
    },
  });

  const fb2 = await prisma.feedback.create({
    data: {
      userId: demo.id,
      moduleId: modMap['CO6050'],
      rating: 5,
      comment: 'Would love more examples in the slides before coursework deadlines.',
      status: FeedbackStatus.acted_on,
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: demo.id,
        title: 'Feedback received',
        description: `Your feedback for CO7100 has been received.`,
        type: 'feedback_received',
        referenceId: fb1.id,
      },
      {
        userId: demo.id,
        title: 'Action taken on your feedback',
        description: 'CO6050 — your feedback has been acted on.',
        type: 'action_taken',
        referenceId: fb2.id,
      },
    ],
  });

  console.log('Seed complete. Demo login: student@chester.ac.uk / Password123');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
