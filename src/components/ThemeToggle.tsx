import { useEffect } from 'react';
import { Sun, Moon, Eye } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';

const themes = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'high-contrast', label: 'High Contrast', icon: Eye },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  // Sinkronkan ke HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="flex items-center gap-2">
      {themes.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          className={`p-2 rounded-lg border transition-colors flex items-center gap-1
            ${theme === id ? 'bg-primary text-white border-primary' : 'border-border hover:bg-accent'}
          `}
          title={label}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
