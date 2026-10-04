"use client";

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { sendMessage, type MessageState } from "@/app/actions/message";
import type { About } from "@/lib/types";
import { profiles, SocialIcon } from "@/lib/socials";

const initialState: MessageState = { status: "idle", message: "", fieldErrors: {}, phoneRequested: false };

function Field({
  label,
  name,
  error,
  required,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.18em] text-[#3B241C]/60">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
      {error ? (
        <span id={`${name}-error`} className="mt-2 block text-sm text-[#C94C4C]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function ContactSection({ about }: { about: About | null }) {
  const [state, action, pending] = useActionState(sendMessage, initialState);
  const [phoneRequested, setPhoneRequested] = useState(false);
  const [closedConfirmation, setClosedConfirmation] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const email = about?.email?.trim() || "";
  const showConfirmation = state.status === "success" && !pending && !closedConfirmation;

  useEffect(() => {
    const openRequest = () => {
      setClosedConfirmation(true);
      setPhoneRequested(true);
      document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("request-phone", openRequest);
    return () => window.removeEventListener("request-phone", openRequest);
  }, []);

  const inputClass = "mt-2 w-full rounded-2xl border border-[#3B241C]/15 bg-white px-4 py-3 text-[#3B241C] outline-none";

  return (
    <section id="contact" className="scroll-mt-24 bg-[#3B241C] px-5 py-12 text-[#F8F1E7] sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#C98F8F]">07 / Contact</p>
          <h2 className="mt-3 font-display text-4xl leading-[0.95] sm:text-6xl">Contact</h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#F8F1E7]/75">Write with your name, email, LinkedIn, and phone. I read every note myself.</p>
          <ul className="mt-6 space-y-3 text-sm">
            {email ? (
              <li>
                <a className="underline decoration-[#C98F8F] underline-offset-4" href={`mailto:${email}`}>
                  {email}
                </a>
              </li>
            ) : null}
            {profiles.map((profile) => (
              <li key={profile.id}>
                <a href={profile.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                  <SocialIcon id={profile.id} />
                  <span>{profile.label}</span>
                  {"handle" in profile && profile.handle ? <span className="text-[#F8F1E7]/60">{profile.handle}</span> : null}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-6 inline-flex min-h-11 items-center rounded-full border border-[#F8F1E7]/25 px-5 text-[11px] uppercase tracking-[0.18em]"
            onClick={() => window.dispatchEvent(new Event("request-phone"))}
          >
            Request phone contact
          </button>
        </div>
        {showConfirmation ? (
          <div className="rounded-[28px] bg-[#F8F1E7] p-6 text-[#3B241C] sm:p-8 lg:col-span-7" role="status">
            <p className="font-display text-4xl">Message received.</p>
            <p className="mt-4 text-base leading-7">Thank you for reaching out. Your details are with me now.</p>
            {state.phoneRequested ? (
              <p className="mt-4 text-base leading-7">Your request for a phone contact has also been noted. I&apos;ll reach out if sharing a number makes sense.</p>
            ) : null}
            <button
              type="button"
              className="mt-6 inline-flex min-h-11 items-center rounded-full border border-[#3B241C]/15 px-5 text-[11px] uppercase tracking-[0.18em]"
              onClick={() => {
                formRef.current?.reset();
                setPhoneRequested(false);
                setClosedConfirmation(true);
              }}
            >
              Write another note
            </button>
          </div>
        ) : (
          <form
            id="contact-form"
            ref={formRef}
            action={async (formData) => {
              setClosedConfirmation(false);
              await action(formData);
            }}
            className="grid gap-4 rounded-[28px] bg-[#F8F1E7] p-5 text-[#3B241C] sm:p-7 lg:col-span-7"
            noValidate
          >
            <Field label="Name" name="name" error={state.fieldErrors.name} required>
              <input className={inputClass} name="name" autoComplete="name" aria-invalid={Boolean(state.fieldErrors.name)} aria-describedby={state.fieldErrors.name ? "name-error" : undefined} required />
            </Field>
            <Field label="Email" name="email" error={state.fieldErrors.email} required>
              <input className={inputClass} name="email" type="email" autoComplete="email" aria-invalid={Boolean(state.fieldErrors.email)} aria-describedby={state.fieldErrors.email ? "email-error" : undefined} required />
            </Field>
            <Field label="LinkedIn" name="linkedinUrl" error={state.fieldErrors.linkedinUrl} required>
              <input className={inputClass} name="linkedinUrl" type="url" inputMode="url" autoComplete="url" placeholder="https://www.linkedin.com/in/your-name" aria-invalid={Boolean(state.fieldErrors.linkedinUrl)} aria-describedby={state.fieldErrors.linkedinUrl ? "linkedinUrl-error" : undefined} required />
            </Field>
            <Field label="Phone number" name="phoneNumber" error={state.fieldErrors.phoneNumber} required>
              <input className={inputClass} name="phoneNumber" type="tel" autoComplete="tel" aria-invalid={Boolean(state.fieldErrors.phoneNumber)} aria-describedby={state.fieldErrors.phoneNumber ? "phoneNumber-error" : undefined} required />
            </Field>
            <Field label="Subject" name="subject" error={state.fieldErrors.subject}>
              <input className={inputClass} name="subject" aria-invalid={Boolean(state.fieldErrors.subject)} aria-describedby={state.fieldErrors.subject ? "subject-error" : undefined} />
            </Field>
            <Field label="Message" name="message" error={state.fieldErrors.message} required>
              <textarea className={`${inputClass} min-h-28 resize-y`} name="message" aria-invalid={Boolean(state.fieldErrors.message)} aria-describedby={state.fieldErrors.message ? "message-error" : undefined} required />
            </Field>
            <label className="flex items-start gap-3 text-sm leading-6">
              <input
                type="checkbox"
                name="phoneRequested"
                value="true"
                className="mt-1 h-4 w-4 accent-[#C94C4C]"
                checked={phoneRequested}
                onChange={(event) => setPhoneRequested(event.target.checked)}
              />
              <span>Request my phone number</span>
            </label>
            {phoneRequested ? (
              <p className="rounded-2xl bg-[#F3D9A5]/70 px-4 py-3 text-sm leading-6 text-[#3B241C]">
                Your contact details will be shared with Priyam so she can decide whether to provide a phone number.
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center rounded-full bg-[#3B241C] px-6 text-[11px] uppercase tracking-[0.18em] text-[#F8F1E7] disabled:opacity-60">
                {pending ? "Sending" : "Send message"}
              </button>
              {state.status === "error" && state.message ? (
                <p role="alert" className="text-sm text-[#C94C4C]">
                  {state.message}
                </p>
              ) : null}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
