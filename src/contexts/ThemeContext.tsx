'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // The no-FOUC script in layout.tsx has already set the class on <html> before
  // hydration; read it back so server/client agree on the initial value.
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const syncTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };
    syncTheme();
    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'grocify-theme') return;
      document.documentElement.classList.toggle('dark', event.newValue === 'dark');
      syncTheme();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next: Theme = root.classList.contains('dark') ? 'light' : 'dark';
    root.classList.toggle('dark', next === 'dark');
    setTheme(next);
    try {
      localStorage.setItem('grocify-theme', next);
    } catch {
      // ignore storage errors (private mode, etc.)
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
