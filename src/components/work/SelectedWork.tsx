"use client";

import { useRef, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import type { Project } from "@/lib/types";
import { isHttpUrl, mediaUrl } from "@/lib/format";
import { SectionHeading } from "@/components/site/SectionHeading";

const layouts = ["md:col-span-7", "md:col-span-5 md:mt-8", "md:col-span-12", "md:col-span-5", "md:col-span-7", "md:col-span-12"];

const washes = ["bg-[#F8F1E7]", "bg-[#3B241C] text-[#F8F1E7]", "bg-[#E8D8C8]", "bg-[#F3D9A5]", "bg-[#F8F1E7]", "bg-[#3B241C] text-[#F8F1E7]"];

const fallbacks = [
  "from-[#F3D9A5] via-[#F8F1E7] to-[#E8D8C8]",
  "from-[#4A3028] via-[#3B241C] to-[#2A1814]",
  "from-[#E8D8C8] via-[#F3D9A5] to-[#F8F1E7]",
  "from-[#C98F8F]/70 via-[#F3D9A5] to-[#F8F1E7]",
  "from-[#F8F1E7] via-[#E8D8C8] to-[#C98F8F]/40",
  "from-[#3B241C] via-[#5A3A32] to-[#C98F8F]/50",
];

function initials(title: string) {
  const words = title.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((word) => word[0]?.toUpperCase() || "").join("") || "P";
}

function ProjectVisual({ project, index, dark }: { project: Project; index: number; dark: boolean }) {
  const cover = mediaUrl(project.coverImage?.publicUrl);

  if (cover) {
    return (
      <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-2xl">
        <Image src={cover} alt={`${project.title} cover`} fill sizes="(max-width: 768px) 92vw, 50vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
      </div>
    );
  }

  return (
    <div className={`relative mb-5 flex aspect-[16/10] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-5 ${fallbacks[index % fallbacks.length]} ${dark ? "text-[#F8F1E7]" : "text-[#3B241C]"}`}>
      <span aria-hidden className="absolute -right-6 -top-8 h-28 w-28 rounded-full border border-current/20" />
      <span aria-hidden className="absolute bottom-4 right-6 h-16 w-16 rounded-[40%] bg-current/10" />
      <p className="relative font-display text-5xl leading-none">{initials(project.title)}</p>
      {project.stack?.length ? (
        <ul className="relative flex flex-wrap gap-2">
          {project.stack.slice(0, 3).map((item) => (
            <li key={item} className="rounded-full bg-current/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 180, damping: 22 });
  const sy = useSpring(py, { stiffness: 180, damping: 22 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-3, 3]);
  const glowX = useTransform(sx, (value) => `${(value + 0.5) * 100}%`);
  const glowY = useTransform(sy, (value) => `${(value + 0.5) * 100}%`);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${glowX} ${glowY}, rgba(201,76,76,0.16), transparent 60%)`;
  const github = isHttpUrl(project.githubUrl) ? project.githubUrl : null;
  const live = isHttpUrl(project.projectUrl) ? project.projectUrl : null;
  const dark = index % 6 === 1 || index % 6 === 5;

  const move = (event: PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.article
      ref={ref}
      onPointerMove={move}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`group relative flex flex-col overflow-hidden rounded-[28px] border border-[#3B241C]/10 p-5 sm:p-6 ${layouts[index % layouts.length]} ${washes[index % washes.length]}`}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: glow }} />
      <p className={`relative text-[11px] tracking-[0.28em] ${dark ? "text-[#F3D9A5]" : "text-[#C98F8F]"}`}>{String(index + 1).padStart(2, "0")}</p>
      <div className="relative mt-3">
        <ProjectVisual project={project} index={index} dark={dark} />
      </div>
      <div className="relative mt-auto">
        <h3 className="font-display text-3xl leading-tight sm:text-[2.1rem]">
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>
        {project.shortDescription ? <p className={`mt-2 max-w-xl text-sm leading-6 ${dark ? "text-[#F8F1E7]/75" : "text-[#3B241C]/72"}`}>{project.shortDescription}</p> : null}
        {project.stack?.length ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.stack.slice(0, 6).map((item) => (
              <li key={item} className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] ${dark ? "bg-white/10" : "bg-[#3B241C]/5"}`}>
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.18em]">
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
        </div>
      </div>
    </motion.article>
  );
}

export function SelectedWork({ projects, more }: { projects: Project[]; more: Project[] }) {
  return (
    <section id="work" className="scroll-mt-24 px-5 py-12 sm:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading index="02" eyebrow="Projects" title="Projects">
          A selection of systems, experiments, and products I&apos;ve built across software, AI, data, and biotechnology.
        </SectionHeading>
        {projects.length ? (
          <div className="grid gap-4 md:grid-cols-12 md:gap-5">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <p className="rounded-[28px] border border-dashed border-[#3B241C]/20 px-6 py-10 text-[#3B241C]/70">No featured projects are published yet.</p>
        )}
        {more.length ? (
          <div className="mt-10 border-t border-[#3B241C]/10 pt-6">
            <h3 className="font-display text-3xl text-[#3B241C]">More projects</h3>
            <ul className="mt-3 divide-y divide-[#3B241C]/10">
              {more.map((project) => (
                <li key={project.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between">
                  <Link href={`/projects/${project.slug}`} className="font-display text-2xl text-[#3B241C]">
                    {project.title}
                  </Link>
                  {project.shortDescription ? <p className="max-w-xl text-sm text-[#3B241C]/65">{project.shortDescription}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
