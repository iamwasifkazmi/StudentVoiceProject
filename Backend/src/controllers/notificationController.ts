import type { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { ok, fail } from '../utils/response';

export async function listNotifications(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const {
      read,
      page = '1',
      limit = '20',
    } = req.query as Record<string, string | undefined>;

    const take = Math.min(Math.max(parseInt(String(limit), 10) || 20, 1), 100);
    const skip = (Math.max(parseInt(String(page), 10) || 1, 1) - 1) * take;

    const where: Prisma.NotificationWhereInput = {
      userId,
      ...(read === 'true' ? { isRead: true } : read === 'false' ? { isRead: false } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.notification.count({ where }),
    ]);

    return ok(res, {
      items: items.map(n => ({
        id: n.id,
        title: n.title,
        description: n.description,
        type: n.type,
        isRead: n.isRead,
        referenceId: n.referenceId,
        createdAt: n.createdAt.toISOString(),
      })),
      pagination: { page: Number(page) || 1, limit: take, total },
    });
  } catch (e) {
    console.error(e);
    return fail(res, 'Failed to load notifications', 500);
  }
}

export async function markRead(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const n = await prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!n) {
      return fail(res, 'Notification not found', 404);
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return ok(res, {
      id: updated.id,
      isRead: updated.isRead,
    });
  } catch (e) {
    console.error(e);
    return fail(res, 'Failed to update notification', 500);
  }
}
