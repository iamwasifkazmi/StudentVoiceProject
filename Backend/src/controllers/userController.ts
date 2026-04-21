import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { ok, fail } from '../utils/response';

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return fail(res, 'User not found', 404);
    }
    return ok(res, {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      studentId: user.studentId,
      notificationPrefs: user.notificationPrefs,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (e) {
    console.error(e);
    return fail(res, 'Failed to load profile', 500);
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const { fullName, notificationPrefs } = req.body as {
      fullName?: string;
      notificationPrefs?: Record<string, unknown>;
    };

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      return fail(res, 'User not found', 404);
    }

    const mergedPrefs =
      notificationPrefs && typeof notificationPrefs === 'object'
        ? {
            ...(existing.notificationPrefs as object),
            ...notificationPrefs,
          }
        : undefined;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName != null && fullName !== '' ? { fullName } : {}),
        ...(mergedPrefs != null ? { notificationPrefs: mergedPrefs as object } : {}),
      },
    });

    return ok(res, {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      studentId: user.studentId,
      notificationPrefs: user.notificationPrefs,
      updatedAt: user.updatedAt.toISOString(),
    });
  } catch (e) {
    console.error(e);
    return fail(res, 'Failed to update profile', 500);
  }
}
