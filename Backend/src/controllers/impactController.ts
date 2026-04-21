import type { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { ok, fail } from '../utils/response';

export async function listImpact(req: Request, res: Response) {
  try {
    const { search, moduleId } = req.query as {
      search?: string;
      moduleId?: string;
    };

    const where: Prisma.ImpactEntryWhereInput = {
      ...(moduleId ? { moduleId } : {}),
      ...(search?.trim()
        ? {
            OR: [
              { youSaid: { contains: search.trim(), mode: 'insensitive' } },
              { weDid: { contains: search.trim(), mode: 'insensitive' } },
              {
                module: {
                  OR: [
                    { name: { contains: search.trim(), mode: 'insensitive' } },
                    { code: { contains: search.trim(), mode: 'insensitive' } },
                  ],
                },
              },
            ],
          }
        : {}),
    };

    const entries = await prisma.impactEntry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        module: {
          select: { id: true, code: true, name: true, lecturerName: true, colourHex: true },
        },
      },
    });

    return ok(
      res,
      entries.map(e => ({
        id: e.id,
        moduleId: e.moduleId,
        module: {
          code: e.module.code,
          name: e.module.name,
          lecturer: e.module.lecturerName,
          colour: e.module.colourHex,
        },
        youSaid: e.youSaid,
        weDid: e.weDid,
        studentCount: e.studentCount,
        createdAt: e.createdAt.toISOString(),
      })),
    );
  } catch (e) {
    console.error(e);
    return fail(res, 'Failed to load impact entries', 500);
  }
}
