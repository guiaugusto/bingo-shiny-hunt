import { useI18n } from '../i18n/I18nContext';
import type { Lang } from '../i18n/translations';

// Rendered as SVG rather than flag emoji (🇺🇸/🇧🇷) because Windows' emoji font
// has no flag glyphs and falls back to showing the raw country-code letters.
function FlagUS() {
  return (
    <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true">
      <rect width="20" height="14" fill="#B22234" />
      <rect y="1.08" width="20" height="1.08" fill="#fff" />
      <rect y="3.23" width="20" height="1.08" fill="#fff" />
      <rect y="5.38" width="20" height="1.08" fill="#fff" />
      <rect y="7.54" width="20" height="1.08" fill="#fff" />
      <rect y="9.69" width="20" height="1.08" fill="#fff" />
      <rect y="11.85" width="20" height="1.08" fill="#fff" />
      <rect width="8" height="7.54" fill="#3C3B6E" />
    </svg>
  );
}

function FlagBR() {
  return (
    <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true">
      <rect width="20" height="14" fill="#009739" />
      <polygon points="10,1.4 18.5,7 10,12.6 1.5,7" fill="#FEDD00" />
      <circle cx="10" cy="7" r="3.2" fill="#012169" />
    </svg>
  );
}

const OPTIONS: { lang: Lang; Flag: () => React.JSX.Element; label: string }[] = [
  { lang: 'en', Flag: FlagUS, label: 'English' },
  { lang: 'pt-BR', Flag: FlagBR, label: 'Português (Brasil)' },
];

export default function LanguageToggle() {
  const { lang, setLang } = useI18n();

  return (
    <div
      style={{
        display: 'flex',
        gap: 2,
        padding: 2,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-divider)',
      }}
    >
      {OPTIONS.map((opt) => {
        const active = lang === opt.lang;
        return (
          <button
            key={opt.lang}
            onClick={() => setLang(opt.lang)}
            aria-label={opt.label}
            aria-pressed={active}
            title={opt.label}
            style={{
              width: 30,
              height: 30,
              display: 'grid',
              placeItems: 'center',
              border: 0,
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              background: active ? 'color-mix(in srgb, var(--color-accent) 20%, transparent)' : 'transparent',
              opacity: active ? 1 : 0.55,
              transition: 'opacity 0.12s, background 0.12s',
            }}
          >
            <opt.Flag />
          </button>
        );
      })}
    </div>
  );
}
