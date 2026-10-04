"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { Achievement, GalleryItem } from "@/lib/types";
import { formatMonthYear, isHttpUrl, mediaUrl } from "@/lib/format";
import { GalleryView, type Slide } from "@/components/media/GalleryView";

function slidesFor(item: Achievement): Slide[] {
  const gallery = (item.gallery || [])
    .map((entry: GalleryItem) => ({
      id: entry.id,
      url: mediaUrl(entry.media?.publicUrl),
      alt: entry.media?.originalName || item.title,
    }))
    .filter((entry): entry is Slide => Boolean(entry.url));
  if (gallery.length) return gallery;
  const cover = mediaUrl(item.coverImage?.publicUrl);
  return cover ? [{ id: `${item.id}-cover`, url: cover, alt: item.title }] : [];
}

function ordered(items: Achievement[]) {
  return [...items].sort((a, b) => {
    const left = a.date ? new Date(a.date).getTime() : Number.NaN;
    const right = b.date ? new Date(b.date).getTime() : Number.NaN;
    if (!Number.isNaN(left) && !Number.isNaN(right) && left !== right) return left - right;
    return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
  });
}

function summary(item: Achievement) {
  const text = item.description?.trim() || item.result?.trim() || "";
  if (text.length <= 140) return text;
  return `${text.slice(0, 137).trim()}…`;
}

export function HackathonSection({ hackathons }: { hackathons: Achievement[] }) {
  const trail = ordered(hackathons);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = trail.find((item) => item.id === activeId) || null;

  return (
    <section id="achievements" className="scroll-mt-24 px-5 py-12 sm:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto max-w-[1440px]">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#C98F8F]">04 / Achievements</p>
        <h2 className="mt-3 font-display text-4xl leading-[0.95] text-[#3B241C] sm:text-5xl">Achievements</h2>
        <p className="mt-3 max-w-2xl text-base text-[#3B241C]/75">A trail of hackathons. Open an entry for the record and its images.</p>
        {trail.length ? (
          <ol className="relative mt-8 space-y-3 border-l border-[#C98F8F]/80 pl-6 sm:pl-8">
            {trail.map((item, index) => {
              const slides = slidesFor(item);
              const when = formatMonthYear(item.date);
              const thumb = slides[0];
              return (
                <li key={item.id} className="relative">
                  <span className="absolute -left-[1.68rem] top-7 h-2.5 w-2.5 rounded-full bg-[#C94C4C] ring-4 ring-[#F8F1E7] sm:-left-[2.18rem]" />
                  <button
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    className="flex w-full items-center gap-4 rounded-[24px] border border-transparent bg-[#F8F1E7] px-4 py-4 text-left transition hover:border-[#3B241C]/10 hover:bg-white sm:px-5"
                  >
                    <span className="relative hidden h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-[#E8D8C8] sm:block">
                      {thumb ? <Image src={thumb.url} alt="" fill sizes="80px" className="object-cover" /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="text-[11px] tracking-[0.22em] text-[#C98F8F]">{String(index + 1).padStart(2, "0")}</span>
                        <span className="text-[11px] uppercase tracking-[0.16em] text-[#C94C4C]">{when || "Date unpublished"}</span>
                      </span>
                      <span className="mt-1 block font-display text-3xl leading-tight text-[#3B241C]">{item.title}</span>
                      <span className="mt-1 block text-sm text-[#3B241C]/70">
                        {[item.organizer, item.result].filter(Boolean).join(" · ") || "Open for the record"}
                      </span>
                      {summary(item) ? <span className="mt-2 block max-w-2xl text-sm leading-6 text-[#3B241C]/75">{summary(item)}</span> : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="mt-6 rounded-[24px] border border-dashed border-[#3B241C]/20 px-5 py-6 text-sm text-[#3B241C]/70">No hackathon records are published yet.</p>
        )}
      </div>
      <HackathonDialog item={active} onClose={() => setActiveId(null)} />
    </section>
  );
}

function HackathonDialog({ item, onClose }: { item: Achievement | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const slides = item ? slidesFor(item) : [];

  useEffect(() => {
    if (!item) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  const links = item
    ? [
        isHttpUrl(item.githubUrl) ? { href: item.githubUrl, label: "GitHub" } : null,
        isHttpUrl(item.liveUrl) ? { href: item.liveUrl, label: "Live demo" } : null,
        isHttpUrl(item.linkedinUrl) ? { href: item.linkedinUrl, label: "LinkedIn" } : null,
      ].filter((link): link is { href: string; label: string } => Boolean(link))
    : [];

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-[#3B241C]/45 p-3 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`hackathon-${item.id}-title`}
            className="max-h-[min(92vh,840px)] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-[#F8F1E7] p-5 text-[#3B241C] sm:p-7"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#C98F8F]">Hackathon</p>
                <h3 id={`hackathon-${item.id}-title`} className="mt-2 font-display text-4xl leading-none sm:text-5xl">
                  {item.title}
                </h3>
              </div>
              <button ref={closeRef} type="button" onClick={onClose} className="rounded-full border border-[#3B241C]/15 px-3 py-1 text-[11px] uppercase tracking-[0.16em]">
                Close
              </button>
            </div>
            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <Fact label="Organizer" value={item.organizer} />
              <Fact label="Date" value={formatMonthYear(item.date)} />
              <Fact label="Location" value={item.location} />
              <Fact label="Result" value={[item.result, item.placement].filter(Boolean).join(" · ")} />
              <Fact label="Project" value={item.projectName} />
            </dl>
            {item.description ? <p className="mt-5 max-w-2xl text-sm leading-6 text-[#3B241C]/80">{item.description}</p> : null}
            {item.technologies?.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {item.technologies.map((tech) => (
                  <li key={tech} className="rounded-full bg-[#E8D8C8] px-3 py-1 text-[11px] uppercase tracking-[0.12em]">
                    {tech}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-5">
              <GalleryView slides={slides} label={item.title} />
            </div>
            {links.length ? (
              <p className="mt-4 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.16em]">
                {links.map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </p>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Fact({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.16em] text-[#C98F8F]">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
