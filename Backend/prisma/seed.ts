import 'dotenv/config';
import { PrismaClient, FeedbackStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { MODULE_DEFINITIONS } from '../src/lib/moduleCatalog';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding modules...');
  for (const m of MODULE_DEFINITIONS) {
    await prisma.module.upsert({
      where: { code: m.code },
      update: {
        name: m.name,
        lecturerName: m.lecturerName,
        colourHex: m.colourHex,
        department: m.department,
      },
      create: {
        id: m.id,
        code: m.code,
        name: m.name,
        lecturerName: m.lecturerName,
        colourHex: m.colourHex,
        department: m.department,
      },
    });
  }

  const modMap = Object.fromEntries(
    (await prisma.module.findMany()).map(x => [x.code, x.id]),
  ) as Record<string, string>;

  console.log('Seeding impact entries...');
  const impacts = [
    {
      code: 'CO7100',
      youSaid: 'Assignment briefs were unclear about word count expectations.',
      weDid: 'All briefs have been updated with a word count checklist.',
      studentCount: 47,
    },
    {
      code: 'CO7115',
      youSaid: 'The Wi-Fi drops constantly near the quiet study zone.',
      weDid: 'IT Services have scheduled a survey and access point upgrade for that building.',
      studentCount: 31,
    },
    {
      code: 'CO7210',
      youSaid: 'The recent assignment was a bit unclear in the requirements.',
      weDid: 'We added a worked example and a short FAQ to the module page.',
      studentCount: 52,
    },
    {
      code: 'CO7315',
      youSaid: 'More worked examples before the coursework would help.',
      weDid: 'Two new seminars now cover past paper walkthroughs.',
      studentCount: 28,
    },
    {
      code: 'CO7316',
      youSaid: 'Lab kit availability was tight near deadlines.',
      weDid: 'Extra lab slots were added plus an online booking calendar.',
      studentCount: 36,
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
      comment:
        'Assignment briefs were unclear about word count expectations.',
      status: FeedbackStatus.received,
    },
  });

  const fb2 = await prisma.feedback.create({
    data: {
      userId: demo.id,
      moduleId: modMap['CO7115'],
      rating: 4,
      comment:
        'The Wi-Fi drops constantly near the quiet study zone. Makes it hard to work.',
      status: FeedbackStatus.acted_on,
    },
  });

  const fb3 = await prisma.feedback.create({
    data: {
      userId: demo.id,
      moduleId: modMap['CO7210'],
      rating: 5,
      comment:
        'The recent assignment was a bit unclear in the requirements, but the lectures are great.',
      status: FeedbackStatus.received,
    },
  });

  const fb4 = await prisma.feedback.create({
    data: {
      userId: demo.id,
      moduleId: modMap['CO7315'],
      rating: 3,
      comment:
        'The Wi-Fi drops constantly near the quiet study zone. Makes it hard to work.',
      status: FeedbackStatus.submitted,
    },
  });

  const fb5 = await prisma.feedback.create({
    data: {
      userId: demo.id,
      moduleId: modMap['CO7316'],
      rating: 4,
      comment:
        'The Wi-Fi drops constantly near the quiet study zone. Makes it hard to work.',
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
        description: 'CO7115 — your feedback has been acted on.',
        type: 'action_taken',
        referenceId: fb2.id,
      },
      {
        userId: demo.id,
        title: 'Feedback received',
        description: 'CO7210 — thanks for your comments.',
        type: 'feedback_received',
        referenceId: fb3.id,
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
