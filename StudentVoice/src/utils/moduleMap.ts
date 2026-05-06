import type { ModuleItem } from '../types/models';

type ApiModule = {
  id: string;
  code: string;
  name: string;
  lecturer: string;
  colour: string;
};

function tintBg(hex: string): string {
  if (hex.startsWith('#') && hex.length === 7) {
    return `${hex}22`;
  }
  return '#F3F4F6';
}

function letterFromModule(m: ApiModule): string {
  const letters = m.code.match(/[A-Za-z]+/g);
  if (letters?.length) {
    return letters.join('').charAt(0).toUpperCase();
  }
  return m.name.charAt(0).toUpperCase();
}

export function moduleFromApi(m: ApiModule): ModuleItem {
  return {
    id: m.id,
    code: m.code,
    name: m.name,
    letter: letterFromModule(m),
    iconBg: tintBg(m.colour),
    iconColor: m.colour,
    statusLine: m.lecturer,
  };
}
