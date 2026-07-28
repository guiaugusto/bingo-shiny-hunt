import { useTheme } from '../theme/ThemeContext';
import type { Theme } from '../theme/ThemeContext';
import { useI18n } from '../i18n/I18nContext';

const OPTIONS: { theme: Theme; icon: string }[] = [
  { theme: 'light', icon: '☀️' },
  { theme: 'dark', icon: '🌙' },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  const labels: Record<Theme, string> = { light: t.lightMode, dark: t.darkMode };

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
        const active = theme === opt.theme;
        return (
          <button
            key={opt.theme}
            onClick={() => setTheme(opt.theme)}
            aria-label={labels[opt.theme]}
            aria-pressed={active}
            title={labels[opt.theme]}
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
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
}
