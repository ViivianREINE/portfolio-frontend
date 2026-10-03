"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useTransform } from "motion/react";
import type { About } from "@/lib/types";
import { isHttpUrl } from "@/lib/format";
import { SocialRail } from "@/lib/socials";
import { useCursorPosition } from "@/hooks/useCursorPosition";

export function Hero({ about }: { about: About | null }) {
  const boundsRef = useRef<HTMLElement>(null);
  const { springX, springY, spotX, spotY, gazeSpring, mode } = useCursorPosition(boundsRef);
  const portraitX = useTransform(springX, (value) => value * 16);
  const portraitY = useTransform(springY, (value) => value * 10);
  const tiltX = useTransform(springY, (value) => value * -6);
  const tiltY = useTransform(springX, (value) => value * 8);
  const portraitScale = useTransform([springX, springY], ([x, y]) => 1 + (Math.abs(Number(x)) + Math.abs(Number(y))) * 0.015);
  const depthX = useTransform(springX, (value) => value * -22);
  const depthY = useTransform(springY, (value) => value * -14);
  const orbitX = useTransform(springX, (value) => value * 28);
  const orbitY = useTransform(springY, (value) => value * 20);
  const closedOpacity = useTransform(gazeSpring, [0, 1], [0, 1]);
  const closedScale = useTransform(gazeSpring, [0, 1], [1.02, 1]);
  const resume = isHttpUrl(about?.resumeUrl) ? about?.resumeUrl : null;
  const location = about?.location?.trim() || "Bengaluru";

  return (
    <section ref={boundsRef} className="relative isolate overflow-hidden px-5 pb-8 pt-24 sm:px-8 lg:px-12 lg:pb-12 lg:pt-28">
      <div className="grain pointer-events-none absolute inset-0" />
      {mode === "track" ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: spotX,
            top: spotY,
            background: "radial-gradient(circle, rgba(243,217,165,0.72) 0%, rgba(201,143,143,0.18) 42%, transparent 70%)",
          }}
        />
      ) : null}
      <div className="relative mx-auto grid max-w-[1440px] items-center gap-8 lg:min-h-[calc(100svh-7.5rem)] lg:grid-cols-12 lg:gap-6">
        <div className="z-10 lg:col-span-6">
          <p className="text-[12px] uppercase tracking-[0.34em] text-[#3B241C]">Priyam Parashar</p>
          <h1 className="mt-3 max-w-[12ch] font-display text-[clamp(2.8rem,5.4vw,5.15rem)] font-medium leading-[0.9] tracking-[-0.03em] text-[#3B241C]">
            Software Engineer &amp;
            <br />
            AI Systems Developer
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.22em] text-[#3B241C]/60">{location}</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#3B241C]/70">AI / ML · Data · Analytics · Automation · Research · Creative Technology</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="#work" className="inline-flex min-h-11 items-center rounded-full bg-[#3B241C] px-6 text-[11px] uppercase tracking-[0.2em] text-[#F8F1E7]">
              View the work
            </a>
            <a href="#contact" className="inline-flex min-h-11 items-center rounded-full border border-[#3B241C]/20 px-6 text-[11px] uppercase tracking-[0.2em] text-[#3B241C]">
              Contact
            </a>
            {resume ? (
              <a href={resume} className="inline-flex min-h-11 items-center px-2 text-[11px] uppercase tracking-[0.2em] text-[#C94C4C]" target="_blank" rel="noreferrer">
                Resume
              </a>
            ) : null}
          </div>
          <div className="mt-6">
            <SocialRail />
          </div>
        </div>
        <div className="relative lg:col-span-6">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-4 top-6 h-32 w-32 rounded-full border border-[#C98F8F]/50 sm:h-40 sm:w-40"
            style={mode === "track" ? { x: orbitX, y: orbitY } : undefined}
            animate={mode === "drift" ? { x: [0, 10, 0], y: [0, -8, 0] } : undefined}
            transition={mode === "drift" ? { duration: 9, repeat: Infinity, ease: "easeInOut" } : undefined}
          />
          <motion.div
            aria-hidden
            className="absolute -right-4 top-8 -z-10 h-[72%] w-[72%] rounded-[42%] bg-[#F3D9A5]/70"
            style={mode === "track" ? { x: depthX, y: depthY } : undefined}
          />
          <motion.div
            data-portrait
            className="relative mx-auto aspect-[736/977] w-full max-w-[460px] [transform-style:preserve-3d]"
            style={
              mode === "track"
                ? { x: portraitX, y: portraitY, rotateX: tiltX, rotateY: tiltY, scale: portraitScale, transformPerspective: 1200 }
                : undefined
            }
            animate={mode === "drift" ? { y: [0, -8, 0] } : undefined}
            transition={mode === "drift" ? { duration: 8, repeat: Infinity, ease: "easeInOut" } : undefined}
          >
            <Image
              src="/portraits/open.jpg"
              alt="Illustrated portrait of Priyam Parashar, eyes open"
              fill
              priority
              sizes="(max-width: 1024px) 88vw, 460px"
              className="object-contain object-center"
            />
            {mode === "track" ? (
              <motion.div className="absolute inset-0" style={{ opacity: closedOpacity, scale: closedScale }}>
                <Image src="/portraits/closed.jpg" alt="" fill sizes="(max-width: 1024px) 88vw, 460px" className="object-contain object-center" />
              </motion.div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
