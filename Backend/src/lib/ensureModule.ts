import type { Module } from '@prisma/client';
import { prisma } from './prisma';
import {
  getModuleDefinitionByCode,
  getModuleDefinitionById,
} from './moduleCatalog';

/**
 * Find a module by id/code, or create/upsert it from the canonical catalog when missing
 * (so mobile submit works even if `db:seed` was never run).
 */
export async function resolveModuleForFeedback(
  moduleId?: string,
  moduleCode?: string,
): Promise<Module | null> {
  const idIn = moduleId && String(moduleId).trim().length > 0 ? moduleId.trim() : null;
  const codeIn =
    moduleCode && String(moduleCode).trim().length > 0
      ? String(moduleCode).trim().toUpperCase()
      : null;

  if (idIn) {
    const byId = await prisma.module.findUnique({ where: { id: idIn } });
    if (byId) {
      return byId;
    }
  }
  if (codeIn) {
    const byCode = await prisma.module.findUnique({ where: { code: codeIn } });
    if (byCode) {
      return byCode;
    }
  }

  const def =
    (idIn ? getModuleDefinitionById(idIn) : undefined) ??
    (codeIn ? getModuleDefinitionByCode(codeIn) : undefined);
  if (!def) {
    return null;
  }

  return prisma.module.upsert({
    where: { code: def.code },
    update: {
      name: def.name,
      lecturerName: def.lecturerName,
      colourHex: def.colourHex,
      department: def.department,
    },
    create: {
      id: def.id,
      code: def.code,
      name: def.name,
      lecturerName: def.lecturerName,
      colourHex: def.colourHex,
      department: def.department,
    },
  });
}
