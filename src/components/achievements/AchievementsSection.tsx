import type { AchievementRecord } from "@/lib/types";

export function AchievementsSection({ achievements }: { achievements: AchievementRecord[] }) {
  if (!achievements.length) return null;

  return (
    <section id="achievements" className="scroll-mt-24 px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#C98F8F]">05 / Achievements</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl leading-tight text-[#3B241C] sm:text-5xl">
          Recognition, milestones, and things I&apos;m proud to have built or reached.
        </h2>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-4">
          {achievements.map((item, index) => (
            <article
              key={item.title}
              className="group min-w-[260px] flex-1 rounded-[24px] bg-[#3B241C] p-5 text-[#F8F1E7] transition duration-300 hover:-translate-y-1 hover:bg-[#4A3028] motion-reduce:transform-none sm:min-w-[280px] md:min-w-0"
            >
              <p className="font-sans text-xs tracking-[0.28em] text-[#F3D9A5] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div className="mt-4 h-px w-8 bg-[#C98F8F] transition-all duration-300 group-hover:w-16" />
              <h3 className="mt-4 font-display text-2xl leading-tight sm:text-3xl">{item.title}</h3>
              {item.detail ? <p className="mt-3 text-sm leading-6 text-[#F8F1E7]/75">{item.detail}</p> : null}
              {item.project ? <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-[#C98F8F]">{item.project}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
