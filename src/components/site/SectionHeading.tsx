import type { ReactNode } from "react";

export function SectionHeading({
  index,
  eyebrow,
  title,
  children,
}: {
  index: string;
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex max-w-3xl flex-col gap-3 md:mb-8">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#C98F8F]">
        {index} / {eyebrow}
      </p>
      <h2 className="font-display text-4xl leading-[0.95] text-[#3B241C] sm:text-5xl">{title}</h2>
      {children ? <div className="max-w-2xl text-base leading-relaxed text-[#3B241C]/75 sm:text-lg">{children}</div> : null}
    </div>
  );
}
