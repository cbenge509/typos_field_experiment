export type Theme = 'light' | 'dark';

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function getStoredTheme(): Theme | null {
  if (typeof localStorage === 'undefined') return null;
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return null;
}

export function getEffectiveTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

export function setTheme(theme: Theme): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', theme);
  }
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
}

export function toggleTheme(): Theme {
  const current = getEffectiveTheme();
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}
