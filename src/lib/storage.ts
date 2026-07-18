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

function defaultData(defaultTitle: string): StoredData {
  const first = newBingo(defaultTitle, 5);
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

export function loadData(defaultTitle: string): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData(defaultTitle);
    const parsed = JSON.parse(raw) as StoredData;
    if (!parsed.bingos || !parsed.bingos.length) return defaultData(defaultTitle);
    parsed.bingos = parsed.bingos.map(sanitizeBingo);
    if (!parsed.bingos.some((b) => b.id === parsed.activeId)) {
      parsed.activeId = parsed.bingos[0].id;
    }
    return parsed;
  } catch {
    return defaultData(defaultTitle);
  }
}

export function saveData(data: StoredData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* storage full or unavailable — non-fatal */
  }
}
