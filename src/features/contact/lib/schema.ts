import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "nameInvalid").max(100, "nameTooLong"),
  email: z
    .string()
    .trim()
    .min(1, "emailInvalid")
    .email("emailInvalid")
    .max(200, "emailTooLong"),
  message: z
    .string()
    .trim()
    .min(10, "messageTooShort")
    .max(2000, "messageTooLong"),
});

export type ContactValues = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactValues;
export type ContactErrors = Partial<Record<ContactField, string>>;

export type ContactStatus = "idle" | "success" | "error";

/** Result of a submit attempt, returned by the Server Action to `useActionState`. */
export interface ContactState {
  status: ContactStatus;
  /** Per-field error keys (validation). */
  errors?: ContactErrors;
  /** Form-level error key (e.g. delivery failure). */
  formError?: string;
}

export const initialContactState: ContactState = { status: "idle" };

export const HONEYPOT_FIELD = "company";

/** Flatten a Zod error to the first error key per field. */
export function getFieldErrors(
  error: z.ZodError<ContactValues>,
): ContactErrors {
  const fieldErrors = error.flatten().fieldErrors;
  const result: ContactErrors = {};
  (Object.keys(fieldErrors) as ContactField[]).forEach((field) => {
    const key = fieldErrors[field]?.[0];
    if (key) result[field] = key;
  });
  return result;
}
