import type { ModuleItem } from '../types/models';
import { moduleFromApi } from '../utils/moduleMap';
import catalog from '../data/courseCatalog.json';

export type CatalogModule = (typeof catalog.modules)[number];

const byCode = new Map<string, CatalogModule>(
  catalog.modules.map(m => [m.code, m]),
);

/** Module catalogue from JSON (single source for codes, titles, colours, ids). */
export function getCatalogModules(): CatalogModule[] {
  return catalog.modules;
}

export function getCatalogModuleByCode(code: string): CatalogModule | undefined {
  return byCode.get(code);
}

export function moduleItemFromCatalog(m: CatalogModule): ModuleItem {
  return moduleFromApi({
    id: m.id,
    code: m.code,
    name: m.name,
    lecturer: m.lecturerName,
    colour: m.colourHex,
  });
}

export function enrichDashboardRecentActivity<
  T extends {
    moduleCode: string;
    moduleName: string;
    moduleColour: string;
  },
>(row: T): T {
  const c = byCode.get(row.moduleCode);
  if (!c) {
    return row;
  }
  return { ...row, moduleName: c.name, moduleColour: c.colourHex };
}

export function enrichFeedbackListRow<
  T extends {
    moduleCode: string;
    moduleName: string;
    moduleColour: string;
  },
>(row: T): T {
  const c = byCode.get(row.moduleCode);
  if (!c) {
    return row;
  }
  return { ...row, moduleName: c.name, moduleColour: c.colourHex };
}

/** Override module labels from catalogue for detail screens. */
export function enrichFeedbackDetail<
  T extends {
    moduleCode: string;
    moduleName: string;
    moduleColour: string;
    lecturerName: string;
  },
>(detail: T): T {
  const c = byCode.get(detail.moduleCode);
  if (!c) {
    return detail;
  }
  return {
    ...detail,
    moduleName: c.name,
    moduleColour: c.colourHex,
    lecturerName: c.lecturerName,
  };
}
