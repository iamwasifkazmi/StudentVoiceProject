import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { hashPassword, verifyPassword } from '../utils/password';
import { ok, fail } from '../utils/response';
import { signAccessToken, refreshExpiresAt } from '../utils/jwt';
import { generateRefreshToken, hashToken } from '../utils/tokens';
import type { User } from '@prisma/client';

function toPublicUser(u: User) {
  return {
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    studentId: u.studentId,
    notificationPrefs: u.notificationPrefs,
    createdAt: u.createdAt.toISOString(),
  };
}

async function issueTokens(user: User) {
  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const rawRefresh = generateRefreshToken();
  const tokenHash = hashToken(rawRefresh);
  const expiresAt = refreshExpiresAt();

  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash, expiresAt },
  });

  return { accessToken, refreshToken: rawRefresh, user: toPublicUser(user) };
}

export async function register(req: Request, res: Response) {
  try {
    const { fullName, email, studentId, password } = req.body as Record<
      string,
      string
    >;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { studentId }] },
    });
    if (existing) {
      return fail(res, 'Email or student ID already registered', 409);
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        fullName,
        email: email.toLowerCase().trim(),
        studentId: studentId.trim(),
        passwordHash,
        notificationPrefs: {
          push: true,
          email: true,
          inApp: true,
        },
      },
    });

    const tokens = await issueTokens(user);
    return ok(res, tokens, 201);
  } catch (e) {
    console.error(e);
    return fail(res, 'Registration failed', 500);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return fail(res, 'Invalid email or password', 401);
    }

    const tokens = await issueTokens(user);
    return ok(res, tokens);
  } catch (e) {
    console.error(e);
    return fail(res, 'Login failed', 500);
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body as { refreshToken?: string };
    if (!refreshToken) {
      return fail(res, 'refreshToken is required', 400);
    }

    const tokenHash = hashToken(refreshToken);
    const record = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!record || record.expiresAt < new Date()) {
      return fail(res, 'Invalid or expired refresh token', 401);
    }

    const user = record.user;

    await prisma.refreshToken.delete({ where: { id: record.id } });

    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const rawRefresh = generateRefreshToken();
    const newHash = hashToken(rawRefresh);
    const expiresAt = refreshExpiresAt();

    await prisma.refreshToken.create({
      data: { userId: user.id, tokenHash: newHash, expiresAt },
    });

    return ok(res, {
      accessToken,
      refreshToken: rawRefresh,
      user: toPublicUser(user),
    });
  } catch (e) {
    console.error(e);
    return fail(res, 'Token refresh failed', 500);
  }
}

export async function forgotPassword(req: Request, res: Response) {
  // No email provider in dissertation scope — acknowledge request
  return ok(res, {
    message: 'If an account exists for this email, reset instructions would be sent.',
  });
}
