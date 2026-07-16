import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import { Label } from "./Label";

export interface FieldProps {
  /** Control id; the error/description ids derive from it (`<id>-error`, `<id>-desc`). */
  id: string;
  label: string;
  required?: boolean;
  /** Localized error message; when set, render the alert region. */
  error?: string;
  /** Optional helper text. */
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Field({
  id,
  label,
  required,
  error,
  description,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {description ? (
        <p id={`${id}-desc`} className="text-small text-muted-foreground">
          {description}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-small text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
