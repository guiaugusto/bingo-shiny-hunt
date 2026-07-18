import { useEffect, useMemo, useState } from 'react';
import type { Cell, PendingPick } from '../types';
import { GAME_DATA, GAME_SUFFIX, CAUGHT_COLOR } from '../constants';
import { spriteUrl } from '../lib/dex';
import { useDex } from '../hooks/useDex';
import { useI18n } from '../i18n/I18nContext';

interface PickerDialogProps {
  initialCell: Cell;
  onCancel: () => void;
  onConfirm: (cell: Cell) => void;
  onRemove?: () => void;
}

export default function PickerDialog({ initialCell, onCancel, onConfirm, onRemove }: PickerDialogProps) {
  const { t } = useI18n();
  const { ensureDexFiles, filesForGame, getDex, loading } = useDex();
  const [game, setGame] = useState(initialCell.game || '');
  const [query, setQuery] = useState('');
  const [random, setRandom] = useState(false);
  const [caught, setCaught] = useState(initialCell.caught);
  const [pending, setPending] = useState<PendingPick | null>(
    initialCell.key ? { key: initialCell.key, name: initialCell.name, baseSlug: initialCell.key } : null,
  );

  useEffect(() => {
    ensureDexFiles(filesForGame(game));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

  const poolAll = getDex(game);

  // The initial pending (from an edited cell) only has its raw key — resolve its
  // real baseSlug from dex data once loaded, so regional auto-swap can match it.
  useEffect(() => {
    if (!initialCell.key) return;
    const match = poolAll.find((p) => p.key === initialCell.key);
    if (match) {
      setPending((prev) => (prev && prev.key === initialCell.key && prev.baseSlug !== match.baseSlug ? { ...prev, baseSlug: match.baseSlug } : prev));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolAll]);

  const autoVariant = (baseSlug: string, g: string) => {
    const suffix = GAME_SUFFIX[g];
    if (!suffix) return null;
    return poolAll.find((p) => p.baseSlug === baseSlug && p.suffix === suffix) || null;
  };

  const handleGameChange = (g: string) => {
    ensureDexFiles(filesForGame(g));
    setGame(g);
    setPending((prev) => {
      if (!prev) return prev;
      const v = autoVariant(prev.baseSlug, g);
      return v ? { key: v.key, name: v.name, baseSlug: v.baseSlug } : prev;
    });
    if (random) setTimeout(rollRandom, 30);
  };

  const rollRandom = () => {
    const pool = getDex(game);
    if (!pool.length) return;
    const p = pool[Math.floor(Math.random() * pool.length)];
    setPending({ key: p.key, name: p.name, baseSlug: p.baseSlug });
  };

  const toggleRandom = (on: boolean) => {
    setRandom(on);
    if (on) setTimeout(rollRandom, 30);
  };

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    let pool = poolAll;
    if (q) pool = pool.filter((p) => p.name.toLowerCase().includes(q) || p.key.includes(q));
    return pool.slice(0, 90);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolAll, q]);

  const dexStatus = loading
    ? t.loadingDex
    : !poolAll.length
      ? t.dexUnavailable
      : q
        ? t.resultsCount(filtered.length)
        : t.dexHint(poolAll.length);

  const confirm = () => {
    if (!pending) return;
    onConfirm({ key: pending.key, name: pending.name, game, caught });
  };

  return (
    <div className="dialog-backdrop" onClick={onCancel}>
      <div
        className="dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ width: 'min(520px, 100%)', maxHeight: '82vh' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="dialog-title">{t.choosePokemon}</span>
          <button className="btn btn-icon btn-ghost" onClick={onCancel} aria-label={t.close}>
            ✕
          </button>
        </div>

        <div className="field">
          <label
            style={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
            }}
          >
            {t.game}
          </label>
          <select className="input" value={game} onChange={(e) => handleGameChange(e.target.value)} style={{ width: '100%', cursor: 'pointer' }}>
            {GAME_DATA.map((g) => (
              <option key={g.id} value={g.id}>
                {g.id === '' ? t.noGame : g.label}
              </option>
            ))}
          </select>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', marginTop: -4 }}>
          <input
            type="checkbox"
            checked={random}
            onChange={(e) => toggleRandom(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: 'var(--color-accent)', cursor: 'pointer' }}
          />
          {t.randomPick}
        </label>

        {random && (
          <button className="btn btn-secondary" onClick={rollRandom} style={{ alignSelf: 'flex-start' }}>
            {t.rollAnother}
          </button>
        )}

        {!random && (
          <>
            <div className="field">
              <div style={{ position: 'relative' }}>
                <input
                  className="input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  autoFocus
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'color-mix(in srgb, var(--color-text) 50%, transparent)', marginTop: -4 }}>
              {dexStatus}
            </div>
            <div
              style={{
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))',
                gap: 6,
                padding: 2,
                flex: 1,
                minHeight: 120,
              }}
            >
              {filtered.map((p) => {
                const sel = pending?.key === p.key;
                return (
                  <button
                    key={p.key}
                    className="sbm-res"
                    onClick={() => setPending({ key: p.key, name: p.name, baseSlug: p.baseSlug })}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                      padding: '8px 4px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      color: 'var(--color-text)',
                      background: sel
                        ? 'color-mix(in srgb, var(--color-accent) 20%, var(--color-surface))'
                        : 'var(--color-surface)',
                      border: sel ? '1px solid var(--color-accent)' : '1px solid var(--color-divider)',
                    }}
                  >
                    <img
                      src={spriteUrl(p.key)}
                      loading="lazy"
                      alt={p.name}
                      style={{ width: 52, height: 52, objectFit: 'contain' }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%',
                      }}
                    >
                      {p.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 10, borderTop: '1px solid var(--color-divider)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {pending ? (
              <>
                <img src={spriteUrl(pending.key)} loading="lazy" alt="" style={{ width: 38, height: 38, objectFit: 'contain', flex: 'none' }} />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    flex: '1 1 80px',
                    minWidth: 60,
                    maxWidth: 160,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {pending.name}
                </span>
                <button
                  className="btn btn-secondary"
                  onClick={() => setCaught((c) => !c)}
                  style={{
                    marginLeft: 'auto',
                    borderColor: caught ? CAUGHT_COLOR : undefined,
                    color: caught ? CAUGHT_COLOR : undefined,
                  }}
                >
                  {caught ? t.caughtLabel : t.markCaught}
                </button>
              </>
            ) : (
              <span style={{ fontSize: 12, color: 'color-mix(in srgb, var(--color-text) 50%, transparent)', flex: 1 }}>
                {t.pickAbove}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            {initialCell.key ? (
              <button
                className="btn btn-ghost"
                onClick={onRemove}
                style={{ color: '#f87171' }}
              >
                {t.remove}
              </button>
            ) : (
              <span />
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" onClick={onCancel}>
                {t.cancel}
              </button>
              <button className="btn btn-primary" onClick={confirm} disabled={!pending}>
                {t.add}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
