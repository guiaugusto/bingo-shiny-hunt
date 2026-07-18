export interface Cell {
  key: string | null;
  name: string;
  game: string;
  caught: boolean;
}

export interface Bingo {
  id: string;
  title: string;
  description: string;
  size: number;
  cells: Cell[];
}

export interface GameInfo {
  id: string;
  label: string;
  abbr?: string;
  c1?: string;
  c2?: string;
}

export interface DexVariant {
  key: string;
  name: string;
  suffix: string;
  baseName: string;
  baseSlug: string;
}

export interface PendingPick {
  key: string;
  name: string;
  baseSlug: string;
}
