import type { DexVariant } from '../types';

const DEX_BASE = 'https://raw.githubusercontent.com/nerdydrew/Random-Pokemon-Generator/main/public/dex/';
const SPRITE_BASE = 'https://raw.githubusercontent.com/nerdydrew/Random-Pokemon-Generator/main/public/sprites/shiny/';
const FILE_CACHE_PREFIX = 'bsh:dexfile:v1:';

export function slugify(name: string): string {
  return (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function spriteUrl(key: string | null | undefined): string {
  return key ? `${SPRITE_BASE}${key}.webp` : '';
}

interface RawForm {
  name?: string;
  spriteSuffix?: string;
}

interface RawMon {
  id: number;
  name: string;
  forms?: RawForm[];
}

export function buildVariants(json: RawMon[]): DexVariant[] {
  const out: DexVariant[] = [];
  json.forEach((mon) => {
    const baseSlug = slugify(mon.name);
    if (mon.forms && mon.forms.length) {
      mon.forms.forEach((f) => {
        const suffix = f.spriteSuffix || '';
        const key = suffix ? `${baseSlug}-${suffix}` : baseSlug;
        out.push({ key, name: f.name || mon.name, suffix, baseName: mon.name, baseSlug });
      });
    } else {
      out.push({ key: baseSlug, name: mon.name, suffix: '', baseName: mon.name, baseSlug });
    }
  });
  return out;
}

/** Fetches (or reads from localStorage cache) one regional dex JSON file, returning flattened variants. */
export async function fetchDexFile(name: string): Promise<DexVariant[]> {
  try {
    const cached = localStorage.getItem(FILE_CACHE_PREFIX + name);
    if (cached) return JSON.parse(cached) as DexVariant[];
  } catch {
    /* ignore cache read errors */
  }
  try {
    const res = await fetch(`${DEX_BASE}${name}.json`);
    const json = (await res.json()) as RawMon[];
    const variants = buildVariants(json);
    try {
      localStorage.setItem(FILE_CACHE_PREFIX + name, JSON.stringify(variants));
    } catch {
      /* storage full or unavailable — non-fatal */
    }
    return variants;
  } catch {
    return [];
  }
}
