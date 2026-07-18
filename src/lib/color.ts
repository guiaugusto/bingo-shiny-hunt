import type { GameInfo } from '../types';

export function luminance(hex: string): number {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function gameTextColor(g?: GameInfo): string {
  if (!g || !g.c1 || !g.c2) return '#e9e9ed';
  const avg = (luminance(g.c1) + luminance(g.c2)) / 2;
  return avg > 0.55 ? '#14121f' : '#ffffff';
}
