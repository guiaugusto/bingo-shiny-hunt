import { useState } from 'react';
import type { Bingo, Cell as CellType } from '../types';
import CellComponent from './Cell';

interface BingoBoardProps {
  bingo: Bingo;
  onTitleChange: (t: string) => void;
  onDescriptionChange: (d: string) => void;
  onEdit: (i: number) => void;
  onClear: (i: number) => void;
}

export default function BingoBoard({
  bingo,
  onTitleChange,
  onDescriptionChange,
  onEdit,
  onClear,
}: BingoBoardProps) {
  const [revealedIdx, setRevealedIdx] = useState<number | null>(null);
  const lpTimer = useState<{ current: ReturnType<typeof setTimeout> | null }>({ current: null })[0];
  const lpHideTimer = useState<{ current: ReturnType<typeof setTimeout> | null }>({ current: null })[0];

  const startLongPress = (i: number) => {
    if (lpTimer.current) clearTimeout(lpTimer.current);
    lpTimer.current = setTimeout(() => {
      setRevealedIdx(i);
      if (lpHideTimer.current) clearTimeout(lpHideTimer.current);
      lpHideTimer.current = setTimeout(() => setRevealedIdx((cur) => (cur === i ? null : cur)), 3000);
    }, 450);
  };
  const cancelLongPress = () => {
    if (lpTimer.current) clearTimeout(lpTimer.current);
  };

  const total = bingo.cells.filter((c: CellType) => c.key).length;
  const caught = bingo.cells.filter((c: CellType) => c.key && c.caught).length;
  const pct = total ? Math.round((caught / total) * 100) : 0;
  const cellGap = bingo.size <= 5 ? 10 : bingo.size <= 9 ? 7 : 5;
  const wrapMax = Math.min(900, bingo.size * 150 + 40);

  return (
    <main
      style={{
        flex: 1,
        padding: 'clamp(20px, 6vw, 48px) clamp(12px, 4vw, 24px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(20px, 5vw, 32px)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 900,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <input
          className="sbm-flat"
          value={bingo.title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Bingo title"
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 500,
            fontSize: 'clamp(22px, 5.5vw, 30px)',
            letterSpacing: '-0.015em',
            padding: '4px 8px',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            width: '100%',
          }}
        />
        <textarea
          className="sbm-flat"
          value={bingo.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Add a description (theme, rules, target region…)"
          rows={1}
          style={{
            fontSize: 14,
            color: 'color-mix(in srgb, var(--color-text) 72%, transparent)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-md)',
            resize: 'none',
            overflow: 'hidden',
            textAlign: 'center',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', maxWidth: 320, padding: '6px 8px' }}>
          <div
            style={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              background: 'var(--color-neutral-800)',
              border: '1px solid var(--color-divider)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: '100%',
                minWidth: pct > 0 ? 4 : 0,
                background: 'var(--color-accent)',
                transition: 'width 0.2s',
              }}
            />
          </div>
          <span style={{ fontSize: 12, color: 'color-mix(in srgb, var(--color-text) 60%, transparent)', whiteSpace: 'nowrap', flex: 'none' }}>
            {caught}/{total} caught
          </span>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: wrapMax, overflowX: 'auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${bingo.size}, 1fr)`,
            gap: cellGap,
            width: '100%',
            minWidth: bingo.size * 56,
          }}
        >
          {bingo.cells.map((cell, i) => (
            <CellComponent
              key={i}
              cell={cell}
              index={i}
              revealed={revealedIdx === i}
              onEdit={onEdit}
              onClear={onClear}
              onLongPressStart={startLongPress}
              onLongPressEnd={cancelLongPress}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
