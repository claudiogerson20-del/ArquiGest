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
    // Armazenamento bloqueado: o tema aplica-se à mesma nesta sessão.
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
      className={cn("inline-flex rounded-full border border-line bg-surface p-0.5", className)}
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
              "flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-200",
              active ? "bg-invert text-on-invert" : "text-muted hover:text-ink",
            )}
          >
            <Icon className="size-4" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
