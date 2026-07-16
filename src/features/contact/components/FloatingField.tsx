import type { FocusEvent, HTMLInputTypeAttribute } from "react";

import { cn } from "@/shared/lib/cn";

export interface FloatingFieldProps {
  id: string;
  name: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "email" | "text";
  invalid?: boolean;
  describedBy?: string;
  error?: string;
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const controlBase =
  "w-full rounded-md border border-border bg-surface px-3 text-body text-foreground transition-colors duration-fast focus-visible:border-accent aria-[invalid=true]:border-danger disabled:cursor-not-allowed disabled:opacity-60";

/**
 * A floating-label field for the contact form. The label rests over the empty
 * control and floats up on focus **or** when filled — driven purely by CSS
 * (`focus-within` + `:has(:not(:placeholder-shown))`), so it needs no JS state
 * and stays in sync even after a programmatic reset. A real `<label htmlFor>` is
 * always present, and the caller wires `aria-invalid` / `aria-describedby`, so
 * accessibility never depends on the visual effect. Placeholder is a single
 * space so `:placeholder-shown` tracks emptiness without showing placeholder text.
 */
export function FloatingField({
  id,
  name,
  label,
  type = "text",
  multiline = false,
  rows = 6,
  required,
  autoComplete,
  inputMode,
  invalid,
  describedBy,
  error,
  onBlur,
}: FloatingFieldProps) {
  const shared = {
    id,
    name,
    required,
    autoComplete,
    placeholder: " ",
    "aria-invalid": invalid ? true : undefined,
    "aria-describedby": describedBy,
    onBlur,
  } as const;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        {multiline ? (
          <textarea
            {...shared}
            rows={rows}
            className={cn(controlBase, "peer min-h-40 pb-2 pt-8")}
          />
        ) : (
          <input
            {...shared}
            type={type}
            inputMode={inputMode}
            className={cn(controlBase, "peer h-14")}
          />
        )}
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute start-3 text-muted-foreground transition-all duration-fast",
            multiline
              ? "top-4 text-body"
              : "top-1/2 -translate-y-1/2 text-body",
            // Floated up when the control is focused (accent) or filled. Scoped to
            // the peer control, so the label's own presence never triggers it.
            "peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-caption peer-focus:text-accent",
            "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-caption",
          )}
        >
          {label}
          {required ? (
            <span className="text-danger" aria-hidden="true">
              {" "}
              *
            </span>
          ) : null}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-small text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
