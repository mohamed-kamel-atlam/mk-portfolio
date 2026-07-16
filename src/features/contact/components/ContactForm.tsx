"use client";

import { CircleCheck } from "lucide-react";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
} from "react";

import { Button } from "@/shared/ui";

import { submitContact } from "../lib/actions";
import {
  contactSchema,
  getFieldErrors,
  HONEYPOT_FIELD,
  initialContactState,
  type ContactErrors,
  type ContactField,
} from "../lib/schema";
import { FloatingField } from "./FloatingField";

export interface ContactFormCopy {
  name: string;
  email: string;
  message: string;
  submit: string;
  submitting: string;
}

export interface ContactFormProps {
  copy: ContactFormCopy;
  /** Error-key → localized message (validation + form-level). */
  errors: Record<string, string>;
  success: { title: string; body: string };
}

const FIELDS: ContactField[] = ["name", "email", "message"];

export function ContactForm({ copy, errors, success }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialContactState,
  );
  const [fieldErrors, setFieldErrors] = useState<ContactErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Mirror server-side validation errors into the single client error source.
  useEffect(() => {
    if (state.status === "error" && state.errors) {
      setFieldErrors(state.errors);
    }
  }, [state]);

  // On success, clear the form and move focus to the announcement.
  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setFieldErrors({});
      successRef.current?.focus();
    }
  }, [state]);

  const messageFor = (field: ContactField): string | undefined => {
    const key = fieldErrors[field];
    return key ? (errors[key] ?? key) : undefined;
  };

  const describedBy = (field: ContactField): string | undefined =>
    fieldErrors[field] ? `${field}-error` : undefined;

  function handleBlur(
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    const field = event.target.name as ContactField;
    if (!FIELDS.includes(field)) return;
    const result = contactSchema.shape[field].safeParse(event.target.value);
    setFieldErrors((prev) => ({
      ...prev,
      [field]: result.success ? undefined : result.error.issues[0]?.message,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    const data = new FormData(event.currentTarget);
    const parsed = contactSchema.safeParse({
      name: data.get("name"),
      email: data.get("email"),
      message: data.get("message"),
    });
    if (parsed.success) {
      setFieldErrors({});
      return; // let the Server Action run
    }
    // Block submission and surface client-side errors.
    event.preventDefault();
    const nextErrors = getFieldErrors(parsed.error);
    setFieldErrors(nextErrors);
    const firstInvalid = FIELDS.find((field) => nextErrors[field]);
    if (firstInvalid) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        ?.focus();
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {state.status === "success" ? (
        <div
          ref={successRef}
          tabIndex={-1}
          role="status"
          className="flex items-start gap-3 rounded-lg border border-success bg-surface-muted p-4 focus-visible:outline-none motion-safe:animate-fade-in-up"
        >
          <CircleCheck
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-success motion-safe:animate-scale-in"
          />
          <div className="flex flex-col gap-1">
            <p className="font-medium text-foreground">{success.title}</p>
            <p className="text-small text-muted-foreground">{success.body}</p>
          </div>
        </div>
      ) : null}

      <form
        ref={formRef}
        action={formAction}
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-5"
      >
        <fieldset
          disabled={isPending}
          className="m-0 flex min-w-0 flex-col gap-5 border-0 p-0"
        >
          <FloatingField
            id="name"
            name="name"
            label={copy.name}
            type="text"
            autoComplete="name"
            required
            invalid={Boolean(fieldErrors.name)}
            describedBy={describedBy("name")}
            error={messageFor("name")}
            onBlur={handleBlur}
          />

          <FloatingField
            id="email"
            name="email"
            label={copy.email}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            invalid={Boolean(fieldErrors.email)}
            describedBy={describedBy("email")}
            error={messageFor("email")}
            onBlur={handleBlur}
          />

          <FloatingField
            id="message"
            name="message"
            label={copy.message}
            multiline
            rows={6}
            required
            invalid={Boolean(fieldErrors.message)}
            describedBy={describedBy("message")}
            error={messageFor("message")}
            onBlur={handleBlur}
          />

          {/* Honeypot — hidden from users and assistive tech; bots that fill it
              are rejected on the server. */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor={HONEYPOT_FIELD}>Company</label>
            <input
              id={HONEYPOT_FIELD}
              name={HONEYPOT_FIELD}
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {state.status === "error" && state.formError ? (
            <p role="alert" className="text-small text-danger">
              {errors[state.formError] ?? state.formError}
            </p>
          ) : null}

          <div>
            <Button type="submit" size="lg" isLoading={isPending}>
              {isPending ? copy.submitting : copy.submit}
            </Button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
