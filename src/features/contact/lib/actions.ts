"use server";

import {
  contactSchema,
  getFieldErrors,
  HONEYPOT_FIELD,
  type ContactState,
  type ContactValues,
} from "./schema";

async function deliverContact(data: ContactValues): Promise<void> {
  const endpoint = process.env.CONTACT_WEBHOOK_URL;
  if (!endpoint || !endpoint.startsWith("https://")) return;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Contact delivery failed: ${response.status}`);
  }
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: real users never fill this. Drop bots silently (report success so
  // they get no signal), without processing the submission.
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "success" };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { status: "error", errors: getFieldErrors(parsed.error) };
  }

  try {
    await deliverContact(parsed.data);
  } catch {
    return { status: "error", formError: "submitFailed" };
  }

  return { status: "success" };
}
