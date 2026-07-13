import type { LabelHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Append a required marker (decorative; pair with `required` on the control). */
  required?: boolean;
}

/** Form field label at the small type step, medium weight. */
export function Label({ required, className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn("text-small font-medium text-foreground", className)}
      {...props}
    >
      {children}
      {required ? (
        <span className="text-danger" aria-hidden="true">
          {" "}
          *
        </span>
      ) : null}
    </label>
  );
}
