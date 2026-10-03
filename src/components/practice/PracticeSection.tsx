import Image from "next/image";
import type { Service, Skill, Testimonial, VolunteerRecord } from "@/lib/types";
import { groupSkills, mediaUrl } from "@/lib/format";

export function PracticeSection({
  skills,
  services,
  testimonials,
  volunteering,
}: {
  skills: Skill[];
  services: Service[];
  testimonials: Testimonial[];
  volunteering: VolunteerRecord[];
}) {
  const activeServices = services.filter((service) => service.active !== false && service.title);
  const publishedNotes = testimonials.filter((item) => item.published !== false && item.content);
  const groups = groupSkills(skills);
  const visible = activeServices.length > 0 || groups.length > 0 || volunteering.length > 0 || publishedNotes.length > 0;

  if (!visible) return null;

  const eyebrow = activeServices.length ? "Services" : groups.length ? "Skills" : "Alongside";

  return (
    <section id="practice" className="scroll-mt-24 px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#C98F8F]">06 / {eyebrow}</p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl leading-[0.95] text-[#3B241C] sm:text-5xl">{eyebrow}</h2>

        {activeServices.length ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {activeServices.map((service, index) => (
              <article key={service.id} className="rounded-[24px] border border-[#3B241C]/10 bg-[#F8F1E7] p-5">
                <p className="text-[11px] tracking-[0.2em] text-[#C98F8F]">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-display text-3xl text-[#3B241C]">{service.title}</h3>
                {service.description ? <p className="mt-3 text-sm leading-6 text-[#3B241C]/75">{service.description}</p> : null}
              </article>
            ))}
          </div>
        ) : null}

        {groups.length ? (
          <div className={activeServices.length ? "mt-8" : "mt-6"}>
            {groups.map((group) => (
              <div key={group.category} className="grid gap-3 border-t border-[#3B241C]/10 py-4 md:grid-cols-[200px_1fr] md:items-start">
                <h3 className="font-display text-2xl text-[#3B241C]">{group.category}</h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <li key={skill.id} className="rounded-full border border-[#3B241C]/10 bg-[#F8F1E7] px-3 py-1.5 text-sm text-[#3B241C]">
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}

        {volunteering.length ? (
          <div className="mt-8">
            <h3 className="font-display text-3xl text-[#3B241C]">Volunteering</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {volunteering.map((item) => (
                <article key={`${item.organization}-${item.role}`} className="rounded-[24px] bg-[#F3D9A5]/55 p-5">
                  <h4 className="font-display text-3xl leading-tight text-[#3B241C]">{item.role}</h4>
                  <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[#3B241C]/70">{item.organization}</p>
                  <p className="mt-3 text-sm text-[#C94C4C]">{[item.start, item.end].filter(Boolean).join(" — ")}</p>
                  {item.detail ? <p className="mt-3 text-sm leading-6 text-[#3B241C]/80">{item.detail}</p> : null}
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {publishedNotes.length ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {publishedNotes.map((item) => {
              const avatar = mediaUrl(item.avatarImage?.publicUrl);
              return (
                <blockquote key={item.id} className="rounded-[24px] bg-[#E8D8C8]/60 p-5">
                  <p className="text-base leading-7 text-[#3B241C]">{item.content}</p>
                  <footer className="mt-4 flex items-center gap-3 text-sm text-[#3B241C]/70">
                    {avatar ? (
                      <span className="relative h-10 w-10 overflow-hidden rounded-full">
                        <Image src={avatar} alt="" fill sizes="40px" className="object-cover" />
                      </span>
                    ) : null}
                    <span>
                      {item.name}
                      {item.role ? `, ${item.role}` : ""}
                      {item.company ? `, ${item.company}` : ""}
                    </span>
                  </footer>
                </blockquote>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
