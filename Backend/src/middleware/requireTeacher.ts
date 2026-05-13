import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { fail } from '../utils/response';

export async function requireTeacher(req: Request, res: Response, next: NextFunction) {
  const userId = req.userId;
  if (!userId) {
    return fail(res, 'Unauthorized', 401);
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user || user.role !== 'teacher') {
    return fail(res, 'Teacher access only', 403);
  }
  next();
}
