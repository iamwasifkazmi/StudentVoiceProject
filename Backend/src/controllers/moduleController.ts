import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { ok, fail } from '../utils/response';

export async function listModules(req: Request, res: Response) {
  try {
    const modules = await prisma.module.findMany({
      orderBy: { code: 'asc' },
    });
    return ok(
      res,
      modules.map(m => ({
        id: m.id,
        code: m.code,
        name: m.name,
        lecturer: m.lecturerName,
        colour: m.colourHex,
        department: m.department,
      })),
    );
  } catch (e) {
    console.error(e);
    return fail(res, 'Failed to load modules', 500);
  }
}

export async function getModule(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const module = await prisma.module.findUnique({
      where: { id },
      include: {
        feedback: {
          where: { userId: req.userId!, isDeleted: false },
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: {
            id: true,
            rating: true,
            comment: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });
    if (!module) {
      return fail(res, 'Module not found', 404);
    }
    return ok(res, {
      id: module.id,
      code: module.code,
      name: module.name,
      lecturer: module.lecturerName,
      colour: module.colourHex,
      department: module.department,
      feedbackHistory: module.feedback.map(f => ({
        id: f.id,
        rating: f.rating,
        comment: f.comment,
        status: f.status,
        createdAt: f.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error(e);
    return fail(res, 'Failed to load module', 500);
  }
}
