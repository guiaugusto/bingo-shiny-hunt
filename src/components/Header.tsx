import { useRef, useState } from 'react';
import { FEEDBACK_FORM_URL, GITHUB_REPO_URL, SIZES } from '../constants';
import { useI18n } from '../i18n/I18nContext';
import type { View } from '../App';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import GitHubIcon from './GitHubIcon';

interface HeaderProps {
  size: number;
  onSizeChange: (n: number) => void;
  onClearBoard: () => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
  onExportData: () => void;
  onExportAllData: () => void;
  onImportData: (file: File) => void;
  view: View;
  onViewChange: (v: View) => void;
}

export default function Header({
  size,
  onSizeChange,
  onClearBoard,
  onExportPNG,
  onExportSVG,
  onExportData,
  onExportAllData,
  onImportData,
  view,
  onViewChange,
}: HeaderProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Only collapses the menu on mobile, where actions live in the drawer —
  // on desktop the actions row is always visible, so this is a harmless no-op.
  const runAndClose = (fn: () => void) => () => {
    fn();
    setMenuOpen(false);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 5,
      }}
    >
      {/* Carries the blur/background instead of the <header> itself — a
          backdrop-filter directly on <header> would make it the containing
          block for any position:fixed descendant (the drawer, the scrim),
          trapping them inside the header's own small box instead of the
          full viewport. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          borderBottom: '1px solid var(--color-divider)',
          backdropFilter: 'blur(8px)',
          background: 'color-mix(in srgb, var(--color-bg) 78%, transparent)',
        }}
      />

      <div style={{ padding: '10px clamp(12px, 4vw, 24px)' }}>
        <div className="sbm-header-row">
          {/* Hidden on desktop (.sbm-header-toggle); placed before the brand so
              it sits on the left on mobile, matching the drawer sliding from the left. */}
          <button
            type="button"
            className="btn btn-icon btn-secondary sbm-header-toggle"
            onClick={() => setMenuOpen(true)}
            aria-label={t.menu}
            aria-expanded={menuOpen}
          >
            ☰
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 auto', minWidth: 0 }}>
            <span
              style={{
                display: 'grid',
                placeItems: 'center',
                width: 30,
                height: 30,
                flex: 'none',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-accent-800)',
                color: 'var(--color-accent-200)',
                fontSize: 15,
              }}
            >
              ✦
            </span>
            <span
              style={{
                fontWeight: 600,
                fontSize: 15,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              Bingo Shiny Hunt
            </span>
          </div>

          {/* Desktop: flows in the same row as the brand, wrapping onto its
              own line only if it doesn't fit — tabs lead, then a divider,
              then the rest. Mobile: the fixed-position drawer instead, with
              its own copy of the tabs at the top (.sbm-drawer-tabs). */}
          <div className={`sbm-header-actions${menuOpen ? ' sbm-open' : ''}`}>
            <div className="sbm-drawer-header">
              <div className="sbm-drawer-title">
                <span className="sbm-drawer-brand-icon">✦</span>
                <span>Bingo Shiny Hunt</span>
              </div>
              <button
                type="button"
                className="btn btn-icon btn-ghost"
                onClick={() => setMenuOpen(false)}
                aria-label={t.close}
              >
                ✕
              </button>
            </div>

            <div className="sbm-drawer-tabs">
              <div className="sbm-header-group sbm-header-group--stack">
                <button
                  className={`btn ${view === 'board' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={runAndClose(() => onViewChange('board'))}
                >
                  {t.tabBoards}
                </button>
                <button
                  className={`btn ${view === 'dex' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={runAndClose(() => onViewChange('dex'))}
                >
                  {t.tabDex}
                </button>
              </div>
            </div>

            {/* Desktop only — hidden on mobile, where .sbm-drawer-tabs above
                already covers the same choice. */}
            <div className="sbm-header-tabs-desktop">
              <button className={`btn ${view === 'board' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => onViewChange('board')}>
                {t.tabBoards}
              </button>
              <button className={`btn ${view === 'dex' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => onViewChange('dex')}>
                {t.tabDex}
              </button>
            </div>
            <span className="sbm-header-divider" aria-hidden="true" />

            <div className="sbm-header-section">
              <span className="sbm-header-section-label">{t.sectionAppearance}</span>
              <div className="sbm-header-group">
                <ThemeToggle />
                <LanguageToggle />
              </div>
            </div>

            <div className="sbm-header-section">
              <span className="sbm-header-section-label">{t.sectionBoard}</span>
              <div className="sbm-header-group">
                <label style={{ fontSize: 12, color: 'color-mix(in srgb, var(--color-text) 60%, transparent)' }}>{t.grid}</label>
                <select
                  className="input"
                  value={size}
                  onChange={(e) => onSizeChange(Number(e.target.value))}
                  style={{ width: 'auto', minWidth: 78, cursor: 'pointer' }}
                >
                  {SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}×{s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sbm-header-group sbm-header-group--stack">
                <button className="btn btn-ghost" onClick={runAndClose(onClearBoard)}>
                  <span className="sbm-row-icon">🧹</span>
                  {t.clearBoard}
                </button>
                <button className="btn btn-secondary" onClick={runAndClose(onExportPNG)}>
                  <span className="sbm-row-icon">🖼️</span>
                  PNG
                </button>
                <button className="btn btn-primary" onClick={runAndClose(onExportSVG)}>
                  <span className="sbm-row-icon">🖼️</span>
                  SVG
                </button>
              </div>
            </div>

            <div className="sbm-header-section">
              <span className="sbm-header-section-label">{t.sectionData}</span>
              <div className="sbm-header-group sbm-header-group--stack">
                <button className="btn btn-secondary" onClick={runAndClose(onExportData)}>
                  {t.exportData}
                </button>
                <button className="btn btn-secondary" onClick={runAndClose(onExportAllData)}>
                  {t.exportAllData}
                </button>
                <button className="btn btn-secondary" onClick={runAndClose(() => fileInputRef.current?.click())}>
                  {t.importData}
                </button>
              </div>
            </div>

            <div className="sbm-header-section">
              <span className="sbm-header-section-label">{t.sectionCommunity}</span>
              <div className="sbm-header-group sbm-header-group--stack">
                <a
                  href={FEEDBACK_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  onClick={() => setMenuOpen(false)}
                >
                  {t.feedback}
                </a>
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-icon btn-secondary"
                  aria-label={t.githubRepo}
                  title={t.githubRepo}
                  onClick={() => setMenuOpen(false)}
                >
                  <GitHubIcon />
                  <span className="sbm-github-label">GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file) onImportData(file);
        }}
        style={{ display: 'none' }}
      />

      <div
        onClick={() => setMenuOpen(false)}
        className={`sbm-header-backdrop${menuOpen ? ' sbm-open' : ''}`}
        style={{ position: 'fixed', inset: 0, zIndex: 4 }}
      />
    </header>
  );
}
