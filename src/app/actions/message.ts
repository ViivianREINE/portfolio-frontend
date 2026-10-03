"use server";

import { API_BASE } from "@/lib/api";

export type MessageState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Record<string, string>;
  phoneRequested: boolean;
};

const emptyErrors = {};

function clean(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim() : "";
}

function isLinkedIn(value: string) {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    const host = url.hostname.replace(/^www\./i, "").toLowerCase();
    return host === "linkedin.com" && url.pathname.replace(/\//g, "").length >= 2;
  } catch {
    return false;
  }
}

function isPhone(value: string) {
  if (!/^[+().\-\s\d]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

export async function sendMessage(_previous: MessageState, formData: FormData): Promise<MessageState> {
  const name = clean(formData.get("name"));
  const email = clean(formData.get("email"));
  const linkedinUrl = clean(formData.get("linkedinUrl"));
  const phoneNumber = clean(formData.get("phoneNumber"));
  const subject = clean(formData.get("subject"));
  const message = clean(formData.get("message"));
  const phoneRequested = formData.get("phoneRequested") === "true";
  const fieldErrors: Record<string, string> = {};

  if (!name) fieldErrors.name = "Name is required.";
  else if (name.length > 120) fieldErrors.name = "Use 120 characters or fewer.";

  if (!email) fieldErrors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Enter a valid email.";

  if (!linkedinUrl) fieldErrors.linkedinUrl = "LinkedIn is required.";
  else if (!isLinkedIn(linkedinUrl)) fieldErrors.linkedinUrl = "Enter a LinkedIn profile URL.";

  if (!phoneNumber) fieldErrors.phoneNumber = "Phone number is required.";
  else if (!isPhone(phoneNumber)) fieldErrors.phoneNumber = "Enter a valid phone number.";

  if (subject.length > 200) fieldErrors.subject = "Use 200 characters or fewer.";
  if (!message) fieldErrors.message = "Message is required.";
  else if (message.length > 5000) fieldErrors.message = "Use 5000 characters or fewer.";

  if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "Check the fields and try again.", fieldErrors, phoneRequested: false };
  }

  try {
    const response = await fetch(`${API_BASE}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        linkedinUrl,
        phoneNumber,
        message,
        phoneRequested,
        ...(subject ? { subject } : {}),
      }),
      cache: "no-store",
    });

    const body = (await response.json().catch(() => null)) as {
      success?: boolean;
      message?: string;
      errors?: Record<string, string>;
      data?: { phoneRequested?: boolean };
    } | null;

    if (!response.ok || !body?.success) {
      return {
        status: "error",
        message: body?.message || "The message could not be sent.",
        fieldErrors: body?.errors || emptyErrors,
        phoneRequested: false,
      };
    }

    return {
      status: "success",
      message: "",
      fieldErrors: emptyErrors,
      phoneRequested: Boolean(body.data?.phoneRequested),
    };
  } catch {
    return {
      status: "error",
      message: "The message could not be sent. Please try again.",
      fieldErrors: emptyErrors,
      phoneRequested: false,
    };
  }
}
