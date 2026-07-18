import { useI18n } from '../i18n/I18nContext';
import type { Lang } from '../i18n/translations';

const OPTIONS: { lang: Lang; flag: string; label: string }[] = [
  { lang: 'en', flag: '🇺🇸', label: 'English' },
  { lang: 'pt-BR', flag: '🇧🇷', label: 'Português (Brasil)' },
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
              fontSize: 15,
              lineHeight: 1,
              borderRadius: 'var(--radius-sm)',
              border: 0,
              cursor: 'pointer',
              background: active ? 'color-mix(in srgb, var(--color-accent) 20%, transparent)' : 'transparent',
              opacity: active ? 1 : 0.55,
              transition: 'opacity 0.12s, background 0.12s',
            }}
          >
            {opt.flag}
          </button>
        );
      })}
    </div>
  );
}
