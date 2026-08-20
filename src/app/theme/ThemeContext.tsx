import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ThemeMode = "Claro" | "Escuro" | "Sistema";

const STORAGE_THEME = "ees-theme";
const STORAGE_FONT = "ees-font-size";

type ThemeContextValue = {
  theme: ThemeMode;
  fontSize: number;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  setFontSize: (size: number) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStored<T extends string>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return (value as T) || fallback;
  } catch {
    return fallback;
  }
}

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyAppearance(theme: ThemeMode, fontSize: number) {
  const root = document.documentElement;
  const isDark = theme === "Escuro" || (theme === "Sistema" && systemPrefersDark());
  root.classList.toggle("dark", isDark);
  root.style.setProperty("--font-size", `${fontSize}px`);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const stored = readStored(STORAGE_THEME, "Claro");
    return stored === "Escuro" || stored === "Sistema" ? stored : "Claro";
  });
  const [fontSize, setFontSizeState] = useState(() => {
    const stored = Number(readStored(STORAGE_FONT, "14"));
    return Number.isFinite(stored) ? Math.min(20, Math.max(12, stored)) : 14;
  });

  const isDark = theme === "Escuro" || (theme === "Sistema" && systemPrefersDark());

  useEffect(() => {
    applyAppearance(theme, fontSize);
    try {
      localStorage.setItem(STORAGE_THEME, theme);
      localStorage.setItem(STORAGE_FONT, String(fontSize));
      localStorage.removeItem("ees-accent");
    } catch {
      /* ignore */
    }
  }, [theme, fontSize]);

  useEffect(() => {
    if (theme !== "Sistema") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyAppearance(theme, fontSize);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme, fontSize]);

  const value = useMemo(
    () => ({
      theme,
      fontSize,
      isDark,
      setTheme: setThemeState,
      setFontSize: setFontSizeState,
    }),
    [theme, fontSize, isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
