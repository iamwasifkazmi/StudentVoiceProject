import type { Request, Response } from 'express';
import { FeedbackStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { ok, fail } from '../utils/response';

export async function dashboard(req: Request, res: Response) {
  try {
    const userId = req.userId!;

    const [feedbackCount, actedOnCount, moduleRows, recent] = await Promise.all([
      prisma.feedback.count({ where: { userId, isDeleted: false } }),
      prisma.feedback.count({
        where: { userId, isDeleted: false, status: FeedbackStatus.acted_on },
      }),
      prisma.feedback.findMany({
        where: { userId, isDeleted: false },
        distinct: ['moduleId'],
        select: { moduleId: true },
      }),
      prisma.feedback.findMany({
        where: { userId, isDeleted: false },
        orderBy: { updatedAt: 'desc' },
        take: 10,
        include: {
          module: { select: { code: true, name: true } },
        },
      }),
    ]);

    const lastUpdated =
      recent[0]?.updatedAt.toISOString() ?? new Date().toISOString();

    return ok(res, {
      feedbackCount,
      actedOnCount,
      moduleCount: moduleRows.length,
      lastUpdated,
      recentActivity: recent.map(r => ({
        id: r.id,
        moduleCode: r.module.code,
        moduleName: r.module.name,
        status: r.status,
        snippet: r.comment?.slice(0, 120) ?? '',
        updatedAt: r.updatedAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error(e);
    return fail(res, 'Failed to load dashboard stats', 500);
  }
}
