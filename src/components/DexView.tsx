import { useEffect, useMemo, useState } from 'react';
import type { Bingo } from '../types';
import { CAUGHT_COLOR } from '../constants';
import { spriteUrl } from '../lib/dex';
import { useDex } from '../hooks/useDex';
import { useI18n } from '../i18n/I18nContext';

interface DexViewProps {
  bingos: Bingo[];
}

interface Stat {
  count: number;
  caught: number;
}

export default function DexView({ bingos }: DexViewProps) {
  const { t } = useI18n();
  const { ensureDexFiles, getDex, loading } = useDex();
  const [query, setQuery] = useState('');
  const [onlyTracked, setOnlyTracked] = useState(false);

  useEffect(() => {
    ensureDexFiles(['all']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pool = getDex('');

  const stats = useMemo(() => {
    const map = new Map<string, Stat>();
    for (const b of bingos) {
      for (const c of b.cells) {
        if (!c.key) continue;
        const entry = map.get(c.key) || { count: 0, caught: 0 };
        entry.count += 1;
        if (c.caught) entry.caught += 1;
        map.set(c.key, entry);
      }
    }
    return map;
  }, [bingos]);

  const trackedCount = useMemo(() => {
    let n = 0;
    stats.forEach((s) => {
      if (s.count > 0) n++;
    });
    return n;
  }, [stats]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    let list = pool;
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q) || p.key.includes(q));
    if (onlyTracked) list = list.filter((p) => (stats.get(p.key)?.count || 0) > 0);
    return list;
  }, [pool, q, onlyTracked, stats]);

  const statusLine = loading && !pool.length
    ? t.loadingDex
    : !pool.length
      ? t.dexUnavailable
      : q || onlyTracked
        ? t.resultsCount(filtered.length)
        : t.dexSummary(trackedCount, pool.length);

  return (
    <main
      style={{
        flex: 1,
        padding: 'clamp(20px, 6vw, 48px) clamp(12px, 4vw, 24px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(16px, 4vw, 24px)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 1100, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          <input
            className="input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.dexSearchPlaceholder}
            style={{ flex: '1 1 220px' }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', flex: 'none' }}>
            <input
              type="checkbox"
              checked={onlyTracked}
              onChange={(e) => setOnlyTracked(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: 'var(--color-accent)', cursor: 'pointer' }}
            />
            {t.dexOnlyTracked}
          </label>
        </div>
        <div style={{ fontSize: 12, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>{statusLine}</div>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 1100,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(92px, 1fr))',
          gap: 10,
        }}
      >
        {filtered.map((p) => {
          const s = stats.get(p.key);
          const count = s?.count || 0;
          const caught = (s?.caught || 0) > 0;
          const tracked = count > 0;
          return (
            <div
              key={p.key}
              title={tracked ? t.dexTileTitle(count, s?.caught || 0) : p.name}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '10px 6px 8px',
                borderRadius: 'var(--radius-md)',
                background: 'color-mix(in srgb, var(--color-text) 5%, transparent)',
                boxShadow: caught ? `0 0 0 2px ${CAUGHT_COLOR}` : '0 0 0 1px var(--color-neutral-800)',
              }}
            >
              {tracked && (
                <span
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    minWidth: 18,
                    height: 18,
                    padding: '0 4px',
                    borderRadius: 999,
                    background: caught ? CAUGHT_COLOR : 'var(--color-accent)',
                    color: caught ? '#0b3b2a' : '#14121f',
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'grid',
                    placeItems: 'center',
                    lineHeight: 1,
                  }}
                >
                  {count}
                </span>
              )}
              <img
                src={spriteUrl(p.key)}
                loading="lazy"
                alt={p.name}
                style={{
                  width: 56,
                  height: 56,
                  objectFit: 'contain',
                  filter: tracked ? 'none' : 'grayscale(0.9) opacity(0.4)',
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%',
                }}
              >
                {p.name}
              </span>
              {typeof p.id === 'number' && (
                <span style={{ fontSize: 9, color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>
                  #{String(p.id).padStart(4, '0')}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
