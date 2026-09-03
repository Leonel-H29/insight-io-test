import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'task-app-theme';
const LIGHT_THEME: Theme = 'light';
const DARK_THEME: Theme = 'dark';

export const useThemeContext = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
};

const getInitialTheme = (): Theme => {
  // Load from localStorage on initial render
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === DARK_THEME || stored === LIGHT_THEME) {
      return stored;
    }
  } catch {
    // localStorage might not be available
  }

  // Check system preference
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return DARK_THEME;
  }

  return LIGHT_THEME;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    // Apply theme to document using Bootstrap's data-bs-theme attribute
    document.documentElement.setAttribute('data-bs-theme', theme);

    // Save to localStorage
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // localStorage might not be available
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === LIGHT_THEME ? DARK_THEME : LIGHT_THEME));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
