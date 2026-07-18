import type { Bingo, Cell } from '../types';
import { GAME_MAP, CAUGHT_COLOR } from '../constants';
import { spriteUrl } from './dex';

export interface ExportLabels {
  untitled: string;
  caughtOf: (caught: number, total: number) => string;
}

interface Layout {
  P: number;
  cell: number;
  gap: number;
  gridW: number;
  titleH: number;
  W: number;
  H: number;
  gridTop: number;
}

function layoutFor(b: Bingo): Layout {
  const P = 56;
  const cell = 200;
  const gap = 16;
  const gridW = b.size * cell + (b.size - 1) * gap;
  const titleH = b.description ? 128 : 96;
  return { P, cell, gap, gridW, titleH, W: gridW + 2 * P, H: P + titleH + gridW + P, gridTop: P + titleH };
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

async function prepImages(cells: Cell[]): Promise<Record<string, HTMLImageElement | null>> {
  const map: Record<string, HTMLImageElement | null> = {};
  await Promise.all(
    cells
      .filter((c) => c.key)
      .map(async (c) => {
        const key = c.key as string;
        if (map[key] !== undefined) return;
        map[key] = await loadImage(spriteUrl(key));
      }),
  );
  return map;
}

function paint(
  ctx: CanvasRenderingContext2D,
  b: Bingo,
  L: Layout,
  imgs: Record<string, HTMLImageElement | null>,
  labels: ExportLabels,
) {
  const { P, cell, gap, gridTop } = L;
  ctx.fillStyle = '#161826';
  ctx.fillRect(0, 0, L.W, L.H);
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#e9e9ed';
  ctx.font = '600 40px Inter, system-ui, sans-serif';
  ctx.fillText(b.title || labels.untitled, P, P + 40);
  if (b.description) {
    ctx.fillStyle = 'rgba(233,233,237,0.62)';
    ctx.font = '400 20px Inter, system-ui, sans-serif';
    ctx.fillText(b.description.slice(0, 90), P, P + 74);
  }
  const caught = b.cells.filter((c) => c.key && c.caught).length;
  const total = b.cells.filter((c) => c.key).length;
  ctx.fillStyle = '#9184d9';
  ctx.font = '600 18px Inter, system-ui, sans-serif';
  ctx.fillText(labels.caughtOf(caught, total), P, gridTop - 20);

  for (let i = 0; i < b.cells.length; i++) {
    const c = b.cells[i];
    const row = Math.floor(i / b.size);
    const col = i % b.size;
    const x = P + col * (cell + gap);
    const y = gridTop + row * (cell + gap);
    ctx.fillStyle = '#232532';
    roundRect(ctx, x, y, cell, cell, 16);
    ctx.fill();

    if (c.key && imgs[c.key]) {
      const img = imgs[c.key] as HTMLImageElement;
      const box = cell - 60;
      const ix = x + 30;
      const iy = y + 18;
      const rt = Math.min(box / img.width, box / img.height);
      const w = img.width * rt;
      const h = img.height * rt;
      ctx.save();
      if (!c.caught) ctx.filter = 'grayscale(0.9) opacity(0.55)';
      ctx.drawImage(img, ix + (box - w) / 2, iy + (box - h) / 2, w, h);
      ctx.restore();
    }

    if (c.key) {
      ctx.fillStyle = '#e9e9ed';
      ctx.font = '500 17px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(c.name, x + cell / 2, y + cell - 22, cell - 20);
      const gm = GAME_MAP[c.game];
      if (gm && gm.id) {
        ctx.font = '600 12px Inter, system-ui, sans-serif';
        const label = gm.abbr || gm.label;
        const tw = ctx.measureText(label).width + 16;
        const tx = x + (cell - tw) / 2;
        const ty = y + cell - 16;
        const grad = ctx.createLinearGradient(tx, 0, tx + tw, 0);
        grad.addColorStop(0, gm.c1 || '#423a6a');
        grad.addColorStop(1, gm.c2 || '#423a6a');
        ctx.fillStyle = grad;
        roundRect(ctx, tx, ty, tw, 18, 6);
        ctx.fill();
        ctx.fillStyle = '#14121f';
        ctx.fillText(label, x + cell / 2, y + cell - 3);
      }
      ctx.textAlign = 'left';
    }

    if (c.key && c.caught) {
      ctx.strokeStyle = CAUGHT_COLOR;
      ctx.lineWidth = 3;
      roundRect(ctx, x + 1.5, y + 1.5, cell - 3, cell - 3, 15);
      ctx.stroke();
    }
  }
}

function slug(b: Bingo): string {
  return (
    (b.title || 'shiny-bingo')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'shiny-bingo'
  );
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function exportPNG(b: Bingo, labels: ExportLabels): Promise<void> {
  const L = layoutFor(b);
  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = L.W * scale;
  canvas.height = L.H * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);
  const imgs = await prepImages(b.cells);
  paint(ctx, b, L, imgs, labels);
  canvas.toBlob((blob) => {
    if (blob) download(blob, `${slug(b)}.png`);
  }, 'image/png');
}

export async function exportSVG(b: Bingo, labels: ExportLabels): Promise<void> {
  const L = layoutFor(b);
  const imgs = await prepImages(b.cells);
  const data: Record<string, string> = {};
  for (const key in imgs) {
    const img = imgs[key];
    if (!img) continue;
    const t = document.createElement('canvas');
    t.width = img.width;
    t.height = img.height;
    t.getContext('2d')!.drawImage(img, 0, 0);
    try {
      data[key] = t.toDataURL('image/png');
    } catch {
      /* tainted canvas — skip embedding this sprite */
    }
  }
  const esc = (s: string) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const { P, cell, gap, gridTop } = L;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${L.W}" height="${L.H}" viewBox="0 0 ${L.W} ${L.H}" font-family="Inter, system-ui, sans-serif">`;
  s += `<defs><filter id="uncaught" x="-20%" y="-20%" width="140%" height="140%"><feColorMatrix type="saturate" values="0.1"/></filter></defs>`;
  s += `<rect width="100%" height="100%" fill="#161826"/>`;
  s += `<text x="${P}" y="${P + 40}" fill="#e9e9ed" font-size="40" font-weight="600">${esc(b.title || labels.untitled)}</text>`;
  if (b.description) {
    s += `<text x="${P}" y="${P + 74}" fill="#e9e9ed" fill-opacity="0.62" font-size="20">${esc(b.description.slice(0, 90))}</text>`;
  }
  const caught = b.cells.filter((c) => c.key && c.caught).length;
  const total = b.cells.filter((c) => c.key).length;
  s += `<text x="${P}" y="${gridTop - 20}" fill="#9184d9" font-size="18" font-weight="600">${esc(labels.caughtOf(caught, total))}</text>`;

  for (let i = 0; i < b.cells.length; i++) {
    const c = b.cells[i];
    const row = Math.floor(i / b.size);
    const col = i % b.size;
    const x = P + col * (cell + gap);
    const y = gridTop + row * (cell + gap);
    s += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="16" fill="#232532"/>`;
    if (c.key && data[c.key]) {
      const box = cell - 60;
      s += `<image href="${data[c.key]}" x="${x + 30}" y="${y + 18}" width="${box}" height="${box}" preserveAspectRatio="xMidYMid meet"${c.caught ? '' : ' opacity="0.55" filter="url(#uncaught)"'}/>`;
    }
    if (c.key) {
      s += `<text x="${x + cell / 2}" y="${y + cell - 22}" fill="#e9e9ed" font-size="17" font-weight="500" text-anchor="middle">${esc(c.name)}</text>`;
      const gm = GAME_MAP[c.game];
      if (gm && gm.id) {
        const label = gm.abbr || gm.label;
        const tw = label.length * 7 + 16;
        const gid = `tag${i}`;
        s += `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${gm.c1}"/><stop offset="1" stop-color="${gm.c2}"/></linearGradient></defs>`;
        s += `<rect x="${x + (cell - tw) / 2}" y="${y + cell - 16}" width="${tw}" height="18" rx="6" fill="url(#${gid})"/>`;
        s += `<text x="${x + cell / 2}" y="${y + cell - 3}" fill="#14121f" font-size="12" font-weight="600" text-anchor="middle">${esc(label)}</text>`;
      }
    }
    if (c.key && c.caught) {
      s += `<rect x="${x + 1.5}" y="${y + 1.5}" width="${cell - 3}" height="${cell - 3}" rx="15" fill="none" stroke="${CAUGHT_COLOR}" stroke-width="3"/>`;
    }
  }
  s += '</svg>';
  download(new Blob([s], { type: 'image/svg+xml' }), `${slug(b)}.svg`);
}
