"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type Slide = { id: string; url: string; alt: string };

export function GalleryView({
  slides,
  label,
}: {
  slides: Slide[];
  label: string;
}) {
  const [index, setIndex] = useState(0);
  const [origin, setOrigin] = useState<number | null>(null);
  const slideKey = slides.map((slide) => slide.id).join("|");
  const [seenKey, setSeenKey] = useState(slideKey);
  if (seenKey !== slideKey) {
    setSeenKey(slideKey);
    setIndex(0);
  }
  const current = slides[Math.min(index, Math.max(slides.length - 1, 0))];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setIndex((value) => (slides.length ? (value + 1) % slides.length : 0));
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex((value) => (slides.length ? (value - 1 + slides.length) % slides.length : 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length]);

  if (!current) {
    return (
      <div className="flex h-28 items-center justify-center rounded-2xl border border-dashed border-[#3B241C]/15 bg-[#F8F1E7] text-sm text-[#3B241C]/60">
        No images attached yet.
      </div>
    );
  }

  const step = (direction: number) => setIndex((value) => (value + direction + slides.length) % slides.length);

  return (
    <div>
      <div
        className="relative h-44 overflow-hidden rounded-2xl bg-[#E8D8C8] sm:h-56"
        onPointerDown={(event) => setOrigin(event.clientX)}
        onPointerUp={(event) => {
          if (origin == null) return;
          const delta = event.clientX - origin;
          if (delta > 48) step(-1);
          if (delta < -48) step(1);
          setOrigin(null);
        }}
        onPointerCancel={() => setOrigin(null)}
      >
        <Image src={current.url} alt={current.alt} fill sizes="(max-width: 768px) 92vw, 640px" className="object-cover" />
        {slides.length > 1 ? (
          <div className="absolute inset-x-3 bottom-3 flex justify-between">
            <button type="button" className="rounded-full bg-[#F8F1E7]/90 px-3 py-1 text-[11px] uppercase tracking-[0.16em]" onClick={() => step(-1)} aria-label={`Previous ${label} image`}>
              Prev
            </button>
            <button type="button" className="rounded-full bg-[#F8F1E7]/90 px-3 py-1 text-[11px] uppercase tracking-[0.16em]" onClick={() => step(1)} aria-label={`Next ${label} image`}>
              Next
            </button>
          </div>
        ) : null}
      </div>
      {slides.length > 1 ? (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label={`${label} thumbnails`}>
          {slides.map((slide, slideIndex) => (
            <li key={slide.id} className="shrink-0">
              <button
                type="button"
                aria-label={`Show image ${slideIndex + 1}`}
                aria-current={slideIndex === index}
                onClick={() => setIndex(slideIndex)}
                className={`relative h-14 w-16 overflow-hidden rounded-lg border ${slideIndex === index ? "border-[#C94C4C]" : "border-transparent"}`}
              >
                <Image src={slide.url} alt="" fill sizes="64px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
