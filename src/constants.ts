import type { GameInfo } from './types';

export const SIZES = [3, 5, 7, 9, 11, 13];
export const MAX_BINGOS = 20;

export const GAME_DATA: GameInfo[] = [
  { id: '', label: 'No game' },
  { id: 'RB', label: 'Red / Blue', abbr: 'RB', c1: '#E3350D', c2: '#3B82F6' },
  { id: 'Y', label: 'Yellow', abbr: 'Y', c1: '#FFD400', c2: '#FFD400' },
  { id: 'GS', label: 'Gold / Silver', abbr: 'GS', c1: '#D4AF37', c2: '#C0C0C0' },
  { id: 'C', label: 'Crystal', abbr: 'C', c1: '#5EDFFF', c2: '#5EDFFF' },
  { id: 'RS', label: 'Ruby / Sapphire', abbr: 'RS', c1: '#C21807', c2: '#0F52BA' },
  { id: 'E', label: 'Emerald', abbr: 'E', c1: '#00A86B', c2: '#00A86B' },
  { id: 'FRLG', label: 'FireRed / LeafGreen', abbr: 'FRLG', c1: '#FF4500', c2: '#32CD32' },
  { id: 'DP', label: 'Diamond / Pearl', abbr: 'DP', c1: '#4DA6FF', c2: '#F8E9F0' },
  { id: 'Pt', label: 'Platinum', abbr: 'Pt', c1: '#E5E4E2', c2: '#6E6E6E' },
  { id: 'HGSS', label: 'HeartGold / SoulSilver', abbr: 'HGSS', c1: '#D4AF37', c2: '#BFC5CC' },
  { id: 'BW', label: 'Black / White', abbr: 'BW', c1: '#111111', c2: '#F5F5F5' },
  { id: 'B2W2', label: 'Black 2 / White 2', abbr: 'B2W2', c1: '#111111', c2: '#EAF4FF' },
  { id: 'XY', label: 'X / Y', abbr: 'XY', c1: '#2E6BFF', c2: '#D7263D' },
  { id: 'ORAS', label: 'Omega Ruby / Alpha Sapphire', abbr: 'ORAS', c1: '#B22222', c2: '#1565C0' },
  { id: 'SM', label: 'Sun / Moon', abbr: 'SM', c1: '#FF9800', c2: '#3949AB' },
  { id: 'USUM', label: 'Ultra Sun / Ultra Moon', abbr: 'USUM', c1: '#FFB300', c2: '#7E57C2' },
  { id: 'LGPE', label: "Let's Go Pikachu / Eevee", abbr: 'LGPE', c1: '#FFD400', c2: '#8B5A2B' },
  { id: 'SwSh', label: 'Sword / Shield', abbr: 'SwSh', c1: '#00AEEF', c2: '#E53935' },
  { id: 'BDSP', label: 'Brilliant Diamond / Shining Pearl', abbr: 'BDSP', c1: '#64B5F6', c2: '#F8D7E6' },
  { id: 'PLA', label: 'Legends: Arceus', abbr: 'PLA', c1: '#F5F5F5', c2: '#C9A227' },
  { id: 'SV', label: 'Scarlet / Violet', abbr: 'SV', c1: '#C62828', c2: '#6A1B9A' },
  { id: 'LZA', label: 'Legends: Z-A', abbr: 'Z-A', c1: '#7CFF00', c2: '#00C853' },
  { id: 'GO', label: 'GO', abbr: 'GO', c1: '#4B9EF5', c2: '#8E44AD' },
  { id: 'Other', label: 'Other', abbr: 'Other', c1: '#6E6E6E', c2: '#3a3a3a' },
];

export const GAME_MAP: Record<string, GameInfo> = Object.fromEntries(GAME_DATA.map((g) => [g.id, g]));

/** Region-exclusive form suffix that a given game auto-switches a caught Pokémon's sprite to. */
export const GAME_SUFFIX: Record<string, string> = {
  SM: 'alola',
  USUM: 'alola',
  SwSh: 'galar',
  PLA: 'hisui',
  SV: 'paldean',
};

/** Which regional dex JSON file(s) (from nerdydrew/Random-Pokemon-Generator) back each game's search pool. */
export const GAME_DEX_FILES: Record<string, string[]> = {
  '': ['all'],
  RB: ['kanto'],
  Y: ['kanto'],
  GS: ['johto'],
  C: ['johto'],
  RS: ['hoenn'],
  E: ['hoenn'],
  FRLG: ['kanto'],
  DP: ['sinnoh'],
  Pt: ['sinnoh_pt'],
  HGSS: ['johto'],
  BW: ['unova'],
  B2W2: ['unova_b2w2'],
  XY: ['kalos'],
  ORAS: ['hoenn'],
  SM: ['alola'],
  USUM: ['alola_usum'],
  LGPE: ['kanto'],
  SwSh: ['galar'],
  BDSP: ['sinnoh'],
  PLA: ['hisui'],
  SV: ['paldea', 'kitakami', 'blueberry'],
  LZA: ['lumiose'],
  GO: ['all'],
  Other: ['all'],
};

export const CAUGHT_COLOR = '#34d399';
