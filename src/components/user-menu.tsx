"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import { cn } from "@/components/ui";

export function UserMenu({
  name,
  email,
  role,
  signOut,
}: {
  name: string;
  email: string;
  role: string;
  signOut: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const initials =
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Conta"
        className={cn(
          "flex size-9 cursor-pointer items-center justify-center rounded-full font-display text-xs font-bold transition-opacity",
          open ? "bg-primary text-on-primary opacity-90" : "bg-primary text-on-primary hover:opacity-85",
        )}
      >
        {initials}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-line bg-surface p-2 shadow-[var(--shadow-pop)]"
        >
          <div className="border-b border-line px-3 py-2.5">
            <p className="truncate text-[13px] font-medium text-ink">{name}</p>
            <p className="truncate text-xs text-muted">{email}</p>
            <p className="label-tech mt-1.5">{role}</p>
          </div>
          <form action={signOut}>
            <button
              role="menuitem"
              className="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] text-muted transition-colors hover:bg-elevated hover:text-ink"
            >
              <LogOut className="size-4" aria-hidden /> Terminar sessão
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
