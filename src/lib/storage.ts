import type { Bingo, Cell } from '../types';

const STORAGE_KEY = 'bsh:data:v1';

interface StoredData {
  bingos: Bingo[];
  activeId: string;
}

export function emptyCells(size: number): Cell[] {
  return Array.from({ length: size * size }, () => ({
    key: null,
    name: '',
    game: '',
    caught: false,
  }));
}

export function newBingo(title: string, size: number): Bingo {
  return {
    id: (crypto.randomUUID?.() as string) || `bingo-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title,
    description: '',
    size,
    cells: emptyCells(size),
  };
}

function defaultData(): StoredData {
  const first = newBingo('', 5);
  return { bingos: [first], activeId: first.id };
}

/** Drops caught:true on cells with no Pokémon, and truncates/pads cells to match size*size. */
function sanitizeBingo(b: Bingo): Bingo {
  const want = b.size * b.size;
  const cells: Cell[] = [];
  for (let i = 0; i < want; i++) {
    const c = b.cells[i];
    cells.push(c && c.key ? { ...c, caught: !!c.caught } : { key: null, name: '', game: '', caught: false });
  }
  return { ...b, cells };
}

export function loadData(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw) as StoredData;
    if (!parsed.bingos || !parsed.bingos.length) return defaultData();
    parsed.bingos = parsed.bingos.map(sanitizeBingo);
    if (!parsed.bingos.some((b) => b.id === parsed.activeId)) {
      parsed.activeId = parsed.bingos[0].id;
    }
    return parsed;
  } catch {
    return defaultData();
  }
}

export function saveData(data: StoredData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* storage full or unavailable — non-fatal */
  }
}

const IMPORT_MIN_SIZE = 1;
const IMPORT_MAX_SIZE = 15;

function sanitizeImportedCell(raw: unknown): Cell {
  if (!raw || typeof raw !== 'object') return { key: null, name: '', game: '', caught: false };
  const c = raw as Record<string, unknown>;
  const key = typeof c.key === 'string' && c.key ? c.key : null;
  return {
    key,
    name: key && typeof c.name === 'string' ? c.name.slice(0, 100) : '',
    game: key && typeof c.game === 'string' ? c.game : '',
    caught: key ? !!c.caught : false,
  };
}

/** Validates and coerces an untrusted parsed-JSON value into a safe Bingo, or null if it isn't bingo-shaped at all. */
function sanitizeImportedBingo(raw: unknown): Bingo | null {
  if (!raw || typeof raw !== 'object') return null;
  const b = raw as Record<string, unknown>;
  const sizeNum = typeof b.size === 'number' && Number.isFinite(b.size) ? Math.round(b.size) : 5;
  const size = Math.min(IMPORT_MAX_SIZE, Math.max(IMPORT_MIN_SIZE, sizeNum));
  const rawCells = Array.isArray(b.cells) ? b.cells : [];
  const cells: Cell[] = [];
  for (let i = 0; i < size * size; i++) cells.push(sanitizeImportedCell(rawCells[i]));
  return {
    id: (crypto.randomUUID?.() as string) || `bingo-${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`,
    title: typeof b.title === 'string' ? b.title.slice(0, 200) : '',
    description: typeof b.description === 'string' ? b.description.slice(0, 500) : '',
    size,
    cells,
  };
}

export interface ImportParseResult {
  bingos: Bingo[];
  /** Entries present in the file that weren't even bingo-shaped and had to be dropped. */
  invalidCount: number;
}

/** Accepts either our own export shape ({ bingos: [...] }) or a bare array of bingos. Throws on invalid JSON. */
export function parseImportPayload(text: string): ImportParseResult {
  const parsed: unknown = JSON.parse(text);
  const list: unknown[] = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as { bingos?: unknown })?.bingos)
      ? ((parsed as { bingos: unknown[] }).bingos)
      : [];
  const bingos: Bingo[] = [];
  let invalidCount = 0;
  for (const raw of list) {
    const b = sanitizeImportedBingo(raw);
    if (b) bingos.push(b);
    else invalidCount++;
  }
  return { bingos, invalidCount };
}

export interface ExportPayload {
  version: 1;
  exportedAt: string;
  bingos: Bingo[];
}

export function buildExportPayload(bingos: Bingo[]): ExportPayload {
  return { version: 1, exportedAt: new Date().toISOString(), bingos };
}
