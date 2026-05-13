import type { Request, Response } from 'express';
import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { hashPassword, verifyPassword } from '../utils/password';
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
      role: user.role,
      anonymousMode: user.anonymousMode,
      pushNotificationsEnabled: user.pushNotificationsEnabled,
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
    const {
      fullName,
      notificationPrefs,
      anonymousMode,
      pushNotificationsEnabled,
    } = req.body as {
      fullName?: string;
      notificationPrefs?: Record<string, unknown>;
      anonymousMode?: boolean;
      pushNotificationsEnabled?: boolean;
    };

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      return fail(res, 'User not found', 404);
    }

    const basePrefs = { ...(existing.notificationPrefs as Record<string, unknown>) };
    let prefsDirty = false;
    if (notificationPrefs && typeof notificationPrefs === 'object') {
      Object.assign(basePrefs, notificationPrefs);
      prefsDirty = true;
    }
    if (typeof pushNotificationsEnabled === 'boolean') {
      basePrefs.push = pushNotificationsEnabled;
      prefsDirty = true;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName != null && fullName !== '' ? { fullName } : {}),
        ...(prefsDirty ? { notificationPrefs: basePrefs as Prisma.InputJsonValue } : {}),
        ...(typeof anonymousMode === 'boolean' ? { anonymousMode } : {}),
        ...(typeof pushNotificationsEnabled === 'boolean'
          ? { pushNotificationsEnabled }
          : {}),
      },
    });

    return ok(res, {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      studentId: user.studentId,
      role: user.role,
      anonymousMode: user.anonymousMode,
      pushNotificationsEnabled: user.pushNotificationsEnabled,
      notificationPrefs: user.notificationPrefs,
      updatedAt: user.updatedAt.toISOString(),
    });
  } catch (e) {
    console.error(e);
    return fail(res, 'Failed to update profile', 500);
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!currentPassword || !newPassword) {
      return fail(res, 'currentPassword and newPassword are required', 400);
    }
    if (newPassword.length < 8) {
      return fail(res, 'New password must be at least 8 characters', 400);
    }
    if (currentPassword === newPassword) {
      return fail(res, 'New password must be different from your current password', 400);
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return fail(res, 'User not found', 404);
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      return fail(res, 'Current password is incorrect', 401);
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return ok(res, { updated: true });
  } catch (e) {
    console.error(e);
    return fail(res, 'Failed to change password', 500);
  }
}
