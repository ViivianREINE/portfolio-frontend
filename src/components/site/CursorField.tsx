"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CursorField() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 180, damping: 24, mass: 0.45 });
  const ringY = useSpring(y, { stiffness: 180, damping: 24, mass: 0.45 });
  const dotX = useSpring(x, { stiffness: 420, damping: 32, mass: 0.25 });
  const dotY = useSpring(y, { stiffness: 420, damping: 32, mass: 0.25 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const enable = () => setVisible(fine.matches && !reduce.matches);
    enable();
    fine.addEventListener("change", enable);
    reduce.addEventListener("change", enable);

    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      fine.removeEventListener("change", enable);
      reduce.removeEventListener("change", enable);
      window.removeEventListener("pointermove", move);
    };
  }, [x, y]);

  if (!visible) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] hidden md:block">
      <motion.span
        className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C94C4C]/50"
        style={{ left: ringX, top: ringY }}
      />
      <motion.span
        className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C94C4C]"
        style={{ left: dotX, top: dotY }}
      />
    </div>
  );
}
