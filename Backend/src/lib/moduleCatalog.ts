/**
 * Canonical module list — keep in sync with `StudentVoice/src/data/courseCatalog.json`.
 */
export const MODULE_DEFINITIONS = [
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    code: 'CO7100',
    name: 'Research Dissertation',
    lecturerName: 'Dr Stuart Cunningham',
    colourHex: '#7C3AED',
    department: 'Computer Science',
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
    code: 'CO7115',
    name: 'Research Methods',
    lecturerName: 'Dr Priya Nair',
    colourHex: '#2563EB',
    department: 'Computer Science',
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
    code: 'CO7210',
    name: 'Concepts of User Experience',
    lecturerName: 'Dr Jamie Ellis',
    colourHex: '#059669',
    department: 'Computer Science',
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004',
    code: 'CO7315',
    name: 'Bio-Inspired Computation',
    lecturerName: 'Dr Sam Okonkwo',
    colourHex: '#EA580C',
    department: 'Computer Science',
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005',
    code: 'CO7316',
    name: 'Robotics',
    lecturerName: 'Dr Helen Zhou',
    colourHex: '#0284C7',
    department: 'Computer Science',
  },
] as const;

export type ModuleDefinition = (typeof MODULE_DEFINITIONS)[number];

export function getModuleDefinitionByCode(code: string): ModuleDefinition | undefined {
  const c = code.trim().toUpperCase();
  return MODULE_DEFINITIONS.find(m => m.code === c);
}

export function getModuleDefinitionById(id: string): ModuleDefinition | undefined {
  const x = id.trim();
  return MODULE_DEFINITIONS.find(m => m.id === x);
}
