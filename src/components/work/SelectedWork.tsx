"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import type { Project } from "@/lib/types";
import { coverFrom, isHttpUrl, mediaUrl } from "@/lib/format";
import { SectionHeading } from "@/components/site/SectionHeading";
import { GalleryView, type Slide } from "@/components/media/GalleryView";

const washes = ["bg-[#F8F1E7]", "bg-[#F3D9A5]/45"];

function slidesFor(project: Project): Slide[] {
  const cover = coverFrom(project);
  const gallery = (project.gallery || [])
    .map((item) => ({
      id: item.id,
      url: mediaUrl(item.media?.publicUrl),
      alt: item.media?.originalName || project.title,
    }))
    .filter((item): item is Slide => Boolean(item.url));
  if (gallery.length) return gallery;
  return cover ? [{ id: `${project.id}-cover`, url: cover, alt: `${project.title} cover` }] : [];
}

function fineMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 160, damping: 24 });
  const sy = useSpring(py, { stiffness: 160, damping: 24 });
  const shiftX = useTransform(sx, [-0.5, 0.5], [-5, 5]);
  const shiftY = useTransform(sy, [-0.5, 0.5], [-4, 4]);
  const imageX = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const imageY = useTransform(sy, [-0.5, 0.5], [-6, 6]);
  const magnetX = useTransform(sx, [-0.5, 0.5], [-4, 4]);
  const magnetY = useTransform(sy, [-0.5, 0.5], [-3, 3]);
  const glowX = useTransform(sx, (value) => `${(value + 0.5) * 100}%`);
  const glowY = useTransform(sy, (value) => `${(value + 0.5) * 100}%`);
  const glow = useMotionTemplate`radial-gradient(280px circle at ${glowX} ${glowY}, rgba(201,143,143,0.22), transparent 62%)`;
  const cover = coverFrom(project);
  const slides = slidesFor(project);
  const github = isHttpUrl(project.githubUrl) ? project.githubUrl : null;
  const live = isHttpUrl(project.projectUrl) ? project.projectUrl : null;
  const [open, setOpen] = useState(false);

  const move = (event: PointerEvent<HTMLElement>) => {
    if (!fineMotion()) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <>
      <motion.article
        ref={ref}
        onPointerMove={move}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
        style={{ x: shiftX, y: shiftY }}
        className={`group relative flex h-full flex-col rounded-[28px] border border-[#3B241C]/10 p-5 sm:p-6 ${washes[index % washes.length]}`}
      >
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: glow }} />
        <div className="relative aspect-[5/2] w-full overflow-hidden rounded-2xl bg-[#E8D8C8]/80">
          {cover ? (
            <button type="button" className="absolute inset-0" onClick={() => setOpen(true)} aria-label={`Open images for ${project.title}`}>
              <motion.span className="absolute inset-0" style={{ x: imageX, y: imageY, scale: 1.04 }}>
                <Image
                  src={cover}
                  alt={`${project.title} cover`}
                  fill
                  sizes="(max-width: 768px) 92vw, 46vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none"
                />
              </motion.span>
            </button>
          ) : (
            <div className="flex h-full items-end px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#3B241C]/55">Photograph pending</p>
            </div>
          )}
        </div>
        <p className="relative mt-4 text-[11px] tracking-[0.28em] text-[#C98F8F]">{String(index + 1).padStart(2, "0")}</p>
        <h3 className="relative mt-2 font-display text-3xl leading-tight text-[#3B241C]">
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>
        {project.shortDescription ? <p className="relative mt-2 text-sm leading-6 text-[#3B241C]/75">{project.shortDescription}</p> : null}
        {project.stack?.length ? (
          <ul className="relative mt-4 flex flex-wrap gap-2">
            {project.stack.slice(0, 6).map((item) => (
              <li key={item} className="rounded-full bg-[#3B241C]/5 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[#3B241C]">
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <motion.div style={{ x: magnetX, y: magnetY }} className="relative mt-auto flex flex-wrap gap-4 pt-5 text-[11px] uppercase tracking-[0.18em] text-[#3B241C]">
          <Link href={`/projects/${project.slug}`}>View project</Link>
          {github ? (
            <a href={github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          ) : null}
          {live ? (
            <a href={live} target="_blank" rel="noreferrer">
              Live demo
            </a>
          ) : null}
        </motion.div>
      </motion.article>
      {open ? <ProjectDialog project={project} slides={slides} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function ProjectDialog({ project, slides, onClose }: { project: Project; slides: Slide[]; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
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
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#3B241C]/45 p-3 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-${project.id}-title`}
        className="max-h-[min(92vh,760px)] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-[#F8F1E7] p-5 sm:p-7"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 id={`project-${project.id}-title`} className="font-display text-4xl leading-none text-[#3B241C]">
            {project.title}
          </h3>
          <button ref={closeRef} type="button" onClick={onClose} className="rounded-full border border-[#3B241C]/15 px-3 py-1 text-[11px] uppercase tracking-[0.16em]">
            Close
          </button>
        </div>
        <div className="mt-5">
          <GalleryView slides={slides} label={project.title} />
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.16em]">
          <Link href={`/projects/${project.slug}`} className="text-[#C94C4C]">
            Open the project page
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}

export function SelectedWork({ projects, more }: { projects: Project[]; more: Project[] }) {
  return (
    <section id="projects" className="scroll-mt-24 px-5 py-12 sm:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading index="03" eyebrow="Projects" title="Projects">
          A selection of systems, experiments, and products I&apos;ve built across software, AI, data, and biotechnology.
        </SectionHeading>
        {projects.length ? (
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-5">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <p className="rounded-[28px] border border-dashed border-[#3B241C]/20 px-6 py-8 text-[#3B241C]/70">No featured projects are published yet.</p>
        )}
        {more.length ? (
          <div className="mt-8 border-t border-[#3B241C]/10 pt-5">
            <h3 className="font-display text-3xl text-[#3B241C]">More projects</h3>
            <ul className="mt-3 divide-y divide-[#3B241C]/10">
              {more.map((project) => (
                <li key={project.id} className="py-3">
                  <Link href={`/projects/${project.slug}`} className="font-display text-2xl text-[#3B241C]">
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
