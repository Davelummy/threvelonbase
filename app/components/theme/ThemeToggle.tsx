"use client";

import { Moon, Sun } from "lucide-react";
import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "tb-theme";
const THEME_EVENT = "tb-theme-change";

function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark";
}

function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

function readDocumentTheme(): Theme | null {
  const attr = document.documentElement.dataset.theme;
  return isTheme(attr) ? attr : null;
}

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getClientTheme(): Theme {
  return readDocumentTheme() ?? readStoredTheme() ?? systemTheme();
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

/**
 * Resolve a cross-tab `storage` event for the theme key.
 * Returns the theme to apply, or null when the event should be ignored.
 * Callers must apply the returned theme to the document before notifying
 * useSyncExternalStore subscribers so getClientTheme() does not keep a
 * stale document snapshot.
 */
export function resolveStorageThemeUpdate(
  key: string | null,
  newValue: string | null,
  getSystemTheme: () => Theme = systemTheme,
): Theme | null {
  if (key !== STORAGE_KEY) {
    return null;
  }

  if (newValue === null) {
    return getSystemTheme();
  }

  return isTheme(newValue) ? newValue : null;
}

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onMedia = () => {
    // Only react to system changes when the user has not set an explicit preference.
    if (!readStoredTheme()) {
      applyTheme(systemTheme());
      onStoreChange();
    }
  };

  const onStorage = (event: StorageEvent) => {
    const next = resolveStorageThemeUpdate(event.key, event.newValue);
    if (!next) {
      return;
    }
    applyTheme(next);
    onStoreChange();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_EVENT, onStoreChange);
  media.addEventListener("change", onMedia);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_EVENT, onStoreChange);
    media.removeEventListener("change", onMedia);
  };
}

function getServerTheme(): Theme {
  return "light";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getClientTheme, getServerTheme);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable in private mode; still update the live document.
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`.trim()}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <Sun className="theme-icon theme-icon-sun" size={15} />
        <Moon className="theme-icon theme-icon-moon" size={15} />
        <span className="theme-toggle-thumb" />
      </span>
    </button>
  );
}

/** Inline bootstrap script — keep STORAGE_KEY in sync with STORAGE_KEY above. */
export const themeBootstrapScript = `(function(){try{var k='tb-theme';var s=localStorage.getItem(k);var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){}})();`;
