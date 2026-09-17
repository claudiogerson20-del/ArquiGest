"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/components/ui";

type Theme = "light" | "dark" | "system";

const OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
];

const STORAGE_KEY = "arquigest-theme";
const EVENT = "arquigest-theme-change";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "dark" || stored === "light" ? stored : "system";
  } catch {
    return "system";
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  try {
    if (theme === "system") {
      delete root.dataset.theme;
      localStorage.removeItem(STORAGE_KEY);
    } else {
      root.dataset.theme = theme;
      localStorage.setItem(STORAGE_KEY, theme);
    }
  } catch {
    if (theme === "system") delete root.dataset.theme;
    else root.dataset.theme = theme;
  }
  window.dispatchEvent(new Event(EVENT));
}

export function ThemeToggle({ className }: { className?: string }) {
  // No servidor devolve "system"; no cliente lê o valor guardado sem cascata de renders.
  const theme = useSyncExternalStore(subscribe, readTheme, (): Theme => "system");

  return (
    <div
      role="radiogroup"
      aria-label="Tema da aplicação"
      className={cn("inline-flex rounded-md border border-line bg-elevated p-0.5", className)}
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => applyTheme(value)}
            className={cn(
              "flex size-7 cursor-pointer items-center justify-center rounded transition-colors duration-150",
              active ? "bg-surface text-ink shadow-[var(--shadow-card)]" : "text-faint hover:text-ink",
            )}
          >
            <Icon className="size-3.5" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
