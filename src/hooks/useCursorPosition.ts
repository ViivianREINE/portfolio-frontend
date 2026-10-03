"use client";

import { useEffect, useState, type RefObject } from "react";
import { useMotionValue, useSpring } from "motion/react";

type MotionMode = "track" | "drift" | "still";

export function useCursorPosition(boundsRef: RefObject<HTMLElement | null>) {
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const localX = useMotionValue(0);
  const localY = useMotionValue(0);
  const gaze = useMotionValue(0);
  const [mode, setMode] = useState<MotionMode>("still");

  const springX = useSpring(nx, { stiffness: 70, damping: 18, mass: 0.65 });
  const springY = useSpring(ny, { stiffness: 70, damping: 18, mass: 0.65 });
  const spotX = useSpring(localX, { stiffness: 140, damping: 26, mass: 0.4 });
  const spotY = useSpring(localY, { stiffness: 140, damping: 26, mass: 0.4 });
  const gazeSpring = useSpring(gaze, { stiffness: 90, damping: 22, mass: 0.5 });

  useEffect(() => {
    const fineQuery = window.matchMedia("(pointer: fine)");
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMode = () => {
      if (reduceQuery.matches) setMode("still");
      else if (fineQuery.matches) setMode("track");
      else setMode("drift");
    };

    updateMode();
    fineQuery.addEventListener("change", updateMode);
    reduceQuery.addEventListener("change", updateMode);

    const onMove = (event: PointerEvent) => {
      if (reduceQuery.matches || !fineQuery.matches) return;
      const bounds = boundsRef.current;
      if (!bounds) return;

      const rect = bounds.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      nx.set(Math.max(-1, Math.min(1, x)));
      ny.set(Math.max(-1, Math.min(1, y)));
      localX.set(event.clientX - rect.left);
      localY.set(event.clientY - rect.top);

      const portrait = bounds.querySelector<HTMLElement>("[data-portrait]");
      if (!portrait) {
        gaze.set(0);
        return;
      }

      const face = portrait.getBoundingClientRect();
      const inside =
        event.clientX >= face.left &&
        event.clientX <= face.right &&
        event.clientY >= face.top &&
        event.clientY <= face.bottom;
      const relX = (event.clientX - face.left) / face.width;
      const relY = (event.clientY - face.top) / face.height;
      const nearFace = inside && relY < 0.46 && relX > 0.12 && relX < 0.88;
      gaze.set(nearFace ? 1 : 0);
    };

    const onLeave = () => {
      nx.set(0);
      ny.set(0);
      gaze.set(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      fineQuery.removeEventListener("change", updateMode);
      reduceQuery.removeEventListener("change", updateMode);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [boundsRef, gaze, localX, localY, nx, ny]);

  return { springX, springY, spotX, spotY, gazeSpring, mode };
}
