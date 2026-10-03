import type { Experience } from "@/lib/types";
import { employmentLabel, formatPeriod } from "@/lib/format";
import { SectionHeading } from "@/components/site/SectionHeading";

export function ExperienceSection({ experience }: { experience: Experience[] }) {
  return (
    <section id="experience" className="scroll-mt-24 px-5 py-12 sm:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading index="04" eyebrow="Experience" title="Experience">
          A few roles where I&apos;ve learned by building, testing, and fixing things in the real world.
        </SectionHeading>
        {experience.length ? (
          <ol className="timeline relative space-y-3 border-l border-[#C98F8F]/80 pl-6 sm:pl-8">
            {experience.map((item, index) => {
              const period = formatPeriod(item.startDate, item.endDate, item.current);
              const type = employmentLabel(item.employmentType);
              return (
                <li key={item.id} className="group relative">
                  <span className="absolute -left-[1.68rem] top-6 h-2.5 w-2.5 rounded-full bg-[#C94C4C] ring-4 ring-[#F8F1E7] transition-transform duration-300 group-hover:scale-125 sm:-left-[2.18rem] motion-reduce:transform-none" />
                  <article className="rounded-[24px] border border-transparent bg-[#F8F1E7] px-5 py-4 transition duration-300 group-hover:border-[#3B241C]/10 group-hover:bg-white sm:px-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                      <div>
                        <p className="text-[11px] tracking-[0.22em] text-[#C98F8F]">{String(index + 1).padStart(2, "0")}</p>
                        <h3 className="font-display text-3xl leading-tight text-[#3B241C]">{item.role}</h3>
                        <p className="mt-1 text-sm uppercase tracking-[0.16em] text-[#3B241C]/70">{item.company}</p>
                      </div>
                      {period ? <p className="text-sm text-[#C94C4C]">{period}</p> : null}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.16em] text-[#3B241C]/60">
                      {type ? <span>{type}</span> : null}
                      {item.location ? <span>{item.location}</span> : null}
                    </div>
                    {item.description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-[#3B241C]/80 sm:text-base sm:leading-7">{item.description}</p> : null}
                  </article>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="text-[#3B241C]/70">No experience records are published yet.</p>
        )}
      </div>
    </section>
  );
}
