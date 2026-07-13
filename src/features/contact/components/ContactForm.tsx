"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
} from "react";

import { Button, Field, Input, Textarea } from "@/shared/ui";

import { submitContact } from "../lib/actions";
import {
  contactSchema,
  getFieldErrors,
  HONEYPOT_FIELD,
  initialContactState,
  type ContactErrors,
  type ContactField,
} from "../lib/schema";

export interface ContactFormCopy {
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  message: string;
  messagePlaceholder: string;
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

/**
 * Contact form (Client Component — genuine local UI state). Validation runs on
 * the client for fast feedback and again on the server (authoritative) via a
 * Server Action. Localized strings are passed in as props, so no dictionary
 * runtime ships to the client. Loading, error, and success states are handled.
 */
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
          className="flex flex-col gap-1 rounded-lg border border-success bg-surface-muted p-4 focus-visible:outline-none"
        >
          <p className="font-medium text-foreground">{success.title}</p>
          <p className="text-small text-muted-foreground">{success.body}</p>
        </div>
      ) : null}

      <form
        ref={formRef}
        action={formAction}
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-6"
      >
        <fieldset
          disabled={isPending}
          className="m-0 flex min-w-0 flex-col gap-6 border-0 p-0"
        >
          <Field
            id="name"
            label={copy.name}
            required
            error={messageFor("name")}
          >
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder={copy.namePlaceholder}
              required
              aria-invalid={fieldErrors.name ? true : undefined}
              aria-describedby={describedBy("name")}
              onBlur={handleBlur}
            />
          </Field>

          <Field
            id="email"
            label={copy.email}
            required
            error={messageFor("email")}
          >
            <Input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={copy.emailPlaceholder}
              required
              aria-invalid={fieldErrors.email ? true : undefined}
              aria-describedby={describedBy("email")}
              onBlur={handleBlur}
            />
          </Field>

          <Field
            id="message"
            label={copy.message}
            required
            error={messageFor("message")}
          >
            <Textarea
              id="message"
              name="message"
              rows={6}
              placeholder={copy.messagePlaceholder}
              required
              aria-invalid={fieldErrors.message ? true : undefined}
              aria-describedby={describedBy("message")}
              onBlur={handleBlur}
            />
          </Field>

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
