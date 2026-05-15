import type { Request, Response } from 'express';
import { FeedbackStatus, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { ok, fail } from '../utils/response';

function mapModule(m: {
  id: string;
  code: string;
  name: string;
  lecturerName: string;
  colourHex: string;
}) {
  return {
    moduleId: m.id,
    moduleCode: m.code,
    moduleName: m.name,
    lecturerName: m.lecturerName,
    moduleColour: m.colourHex,
  };
}

function submitterPublic(u: { fullName: string; anonymousMode: boolean }) {
  if (u.anonymousMode) {
    return { submitterDisplayName: 'Anonymous', submitterAnonymous: true as const };
  }
  return {
    submitterDisplayName: u.fullName,
    submitterAnonymous: false as const,
  };
}

export async function listAllFeedback(req: Request, res: Response) {
  try {
    const { status, moduleId, sort = 'desc', page = '1', limit = '20' } = req.query as Record<
      string,
      string | undefined
    >;

    const take = Math.min(Math.max(parseInt(String(limit), 10) || 20, 1), 100);
    const skip = (Math.max(parseInt(String(page), 10) || 1, 1) - 1) * take;

    const where: Prisma.FeedbackWhereInput = {
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
        include: {
          module: true,
          user: { select: { fullName: true, anonymousMode: true } },
        },
      }),
      prisma.feedback.count({ where }),
    ]);

    return ok(res, {
      items: rows.map(f => ({
        id: f.id,
        rating: f.rating,
        comment: f.comment,
        status: f.status,
        createdAt: f.createdAt.toISOString(),
        updatedAt: f.updatedAt.toISOString(),
        teacherResponse: f.teacherResponse,
        teacherResponseAt: f.teacherResponseAt?.toISOString() ?? null,
        ...mapModule(f.module),
        ...submitterPublic(f.user),
      })),
      pagination: { page: Number(page) || 1, limit: take, total },
    });
  } catch (e) {
    console.error(e);
    return fail(res, 'Failed to load feedback', 500);
  }
}

export async function getFeedbackDetail(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const f = await prisma.feedback.findFirst({
      where: { id, isDeleted: false },
      include: {
        module: true,
        user: { select: { fullName: true, anonymousMode: true } },
      },
    });
    if (!f) {
      return fail(res, 'Feedback not found', 404);
    }

    return ok(res, {
      id: f.id,
      rating: f.rating,
      comment: f.comment,
      status: f.status,
      createdAt: f.createdAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
      teacherResponse: f.teacherResponse,
      teacherResponseAt: f.teacherResponseAt?.toISOString() ?? null,
      ...mapModule(f.module),
      ...submitterPublic(f.user),
    });
  } catch (e) {
    console.error(e);
    return fail(res, 'Failed to load feedback', 500);
  }
}

export async function respondToFeedback(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { response } = req.body as { response?: string };
    const text = response?.trim();
    if (!text) {
      return fail(res, 'response is required', 400);
    }

    const f = await prisma.feedback.findFirst({
      where: { id, isDeleted: false },
      include: { module: true, user: true },
    });
    if (!f) {
      return fail(res, 'Feedback not found', 404);
    }
    if (f.status === FeedbackStatus.acted_on) {
      return fail(res, 'This feedback is resolved and cannot be updated', 400);
    }

    const updated = await prisma.feedback.update({
      where: { id: f.id },
      data: {
        teacherResponse: text,
        teacherResponseAt: new Date(),
        status:
          f.status === FeedbackStatus.submitted ? FeedbackStatus.received : f.status,
      },
      include: { module: true, user: { select: { fullName: true, anonymousMode: true } } },
    });

    await prisma.notification.create({
      data: {
        userId: f.userId,
        title: 'Staff responded',
        description: `${updated.module.code} — a staff member replied to your feedback.`,
        type: 'action_taken',
        referenceId: updated.id,
      },
    });

    return ok(res, {
      id: updated.id,
      teacherResponse: updated.teacherResponse,
      teacherResponseAt: updated.teacherResponseAt?.toISOString() ?? null,
      status: updated.status,
      ...mapModule(updated.module),
      ...submitterPublic(updated.user),
    });
  } catch (e) {
    console.error(e);
    return fail(res, 'Failed to save response', 500);
  }
}

export async function markFeedbackResolved(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const f = await prisma.feedback.findFirst({
      where: { id, isDeleted: false },
      include: { module: true, user: true },
    });
    if (!f) {
      return fail(res, 'Feedback not found', 404);
    }

    if (f.status === FeedbackStatus.acted_on) {
      return ok(res, {
        id: f.id,
        rating: f.rating,
        comment: f.comment,
        status: f.status,
        createdAt: f.createdAt.toISOString(),
        updatedAt: f.updatedAt.toISOString(),
        teacherResponse: f.teacherResponse,
        teacherResponseAt: f.teacherResponseAt?.toISOString() ?? null,
        ...mapModule(f.module),
        ...submitterPublic(f.user),
      });
    }

    const updated = await prisma.feedback.update({
      where: { id: f.id },
      data: { status: FeedbackStatus.acted_on },
      include: { module: true, user: { select: { fullName: true, anonymousMode: true } } },
    });

    await prisma.notification.create({
      data: {
        userId: f.userId,
        title: 'Feedback resolved',
        description: `${updated.module.code} — staff marked your feedback as resolved.`,
        type: 'action_taken',
        referenceId: updated.id,
      },
    });

    return ok(res, {
      id: updated.id,
      rating: updated.rating,
      comment: updated.comment,
      status: updated.status,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      teacherResponse: updated.teacherResponse,
      teacherResponseAt: updated.teacherResponseAt?.toISOString() ?? null,
      ...mapModule(updated.module),
      ...submitterPublic(updated.user),
    });
  } catch (e) {
    console.error(e);
    return fail(res, 'Failed to mark resolved', 500);
  }
}
