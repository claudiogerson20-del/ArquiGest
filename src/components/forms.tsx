"use client";

import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui";

export type FormState = { error?: string; ok?: string } | undefined;

export function SubmitButton({
  children,
  pendingText = "A guardar…",
  ...props
}: ComponentProps<typeof Button> & { pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-busy={pending} {...props}>
      {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {pending ? pendingText : children}
    </Button>
  );
}

export function FormMessage({ state }: { state: FormState }) {
  if (state?.error)
    return (
      <p
        role="alert"
        className="flex items-start gap-2 rounded-lg bg-danger-soft px-3.5 py-2.5 text-sm text-danger"
      >
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
        {state.error}
      </p>
    );
  if (state?.ok)
    return (
      <p
        role="status"
        className="flex items-start gap-2 rounded-lg bg-success-soft px-3.5 py-2.5 text-sm text-success"
      >
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
        {state.ok}
      </p>
    );
  return null;
}
