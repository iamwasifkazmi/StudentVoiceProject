import type { Request, Response } from 'express';
import { FeedbackStatus, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { ok, fail } from '../utils/response';

const UNDO_MS = 15_000;

function mapFeedback(
  f: {
    id: string;
    rating: number;
    comment: string | null;
    status: FeedbackStatus;
    createdAt: Date;
    updatedAt: Date;
    module: { id: string; code: string; name: string; lecturerName: string };
  },
) {
  return {
    id: f.id,
    moduleId: f.module.id,
    moduleCode: f.module.code,
    moduleName: f.module.name,
    lecturerName: f.module.lecturerName,
    rating: f.rating,
    comment: f.comment,
    status: f.status,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  };
}

export async function listFeedback(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const {
      status,
      moduleId,
      sort = 'desc',
      page = '1',
      limit = '20',
    } = req.query as Record<string, string | undefined>;

    const take = Math.min(Math.max(parseInt(String(limit), 10) || 20, 1), 100);
    const skip = (Math.max(parseInt(String(page), 10) || 1, 1) - 1) * take;

    const where: Prisma.FeedbackWhereInput = {
      userId,
      isDeleted: false,
      ...(status && Object.values(FeedbackStatus).includes(status as FeedbackStatus)
        ? { status: status as FeedbackStatus }
        : {}),
      ...(moduleId ? { moduleId } : {}),
    };

    const orderBy =
      sort === 'asc' ? { createdAt: 'asc' as const } : { createdAt: 'desc' as const };

    const [rows, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        orderBy,
        skip,
        take,
        include: { module: true },
      }),
      prisma.feedback.count({ where }),
    ]);

    return ok(res, {
      items: rows.map(mapFeedback),
      pagination: { page: Number(page) || 1, limit: take, total },
    });
  } catch (e) {
    console.error(e);
    return fail(res, 'Failed to load feedback', 500);
  }
}

export async function getFeedback(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const f = await prisma.feedback.findFirst({
      where: { id, userId, isDeleted: false },
      include: {
        module: true,
      },
    });
    if (!f) {
      return fail(res, 'Feedback not found', 404);
    }

    const [impact, agg] = await Promise.all([
      prisma.impactEntry.findMany({
        where: { moduleId: f.moduleId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.impactEntry.aggregate({
        where: { moduleId: f.moduleId },
        _max: { studentCount: true },
      }),
    ]);

    return ok(res, {
      ...mapFeedback(f),
      closingTheLoop: impact.map(i => ({
        id: i.id,
        youSaid: i.youSaid,
        weDid: i.weDid,
        studentCount: i.studentCount,
        createdAt: i.createdAt.toISOString(),
      })),
      studentCountBadge: agg._max.studentCount ?? 1,
    });
  } catch (e) {
    console.error(e);
    return fail(res, 'Failed to load feedback', 500);
  }
}

export async function createFeedback(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const { moduleId, rating, comment } = req.body as {
      moduleId: string;
      rating: number;
      comment?: string | null;
    };

    const mod = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!mod) {
      return fail(res, 'Module not found', 404);
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId,
        moduleId,
        rating,
        comment: comment?.trim() || null,
        status: FeedbackStatus.submitted,
      },
      include: { module: true },
    });

    await prisma.notification.create({
      data: {
        userId,
        title: 'Feedback received',
        description: `Your feedback for ${mod.code} has been received.`,
        type: 'feedback_received',
        referenceId: feedback.id,
      },
    });

    return ok(res, mapFeedback(feedback), 201);
  } catch (e) {
    console.error(e);
    return fail(res, 'Failed to submit feedback', 500);
  }
}

export async function deleteFeedback(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const f = await prisma.feedback.findFirst({
      where: { id, userId, isDeleted: false },
    });
    if (!f) {
      return fail(res, 'Feedback not found', 404);
    }

    const elapsed = Date.now() - f.createdAt.getTime();
    if (elapsed > UNDO_MS) {
      return fail(res, 'Undo window has expired (15 seconds)', 400);
    }

    await prisma.feedback.update({
      where: { id: f.id },
      data: { isDeleted: true },
    });

    return ok(res, { id: f.id, deleted: true });
  } catch (e) {
    console.error(e);
    return fail(res, 'Failed to delete feedback', 500);
  }
}
