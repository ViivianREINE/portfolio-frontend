import Image from "next/image";
import type { About } from "@/lib/types";
import { mediaUrl, publicDetail } from "@/lib/format";
import { Prose } from "@/components/site/Prose";

export function AboutSection({ about }: { about: About | null }) {
  const profile = about?.profileData;
  const portrait = mediaUrl(about?.profileImage?.publicUrl) || "/portraits/open.jpg";
  const education = profile?.education || [];
  const strengths = profile?.strengths || [];
  const longBio = about?.longBio?.trim() || "";

  return (
    <section id="about" className="scroll-mt-24 bg-[#E8D8C8]/40 px-5 py-12 sm:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#C98F8F]">03 / About</p>
          <h2 className="mt-3 font-display text-4xl text-[#3B241C] sm:text-5xl">About</h2>
          <div className="mt-5 max-w-2xl">
            <Prose text={longBio} />
          </div>
          {!longBio ? <p className="mt-5 text-[#3B241C]/70">The about note has not been published yet.</p> : null}
        </div>
        <div className="lg:col-span-5">
          <div className="relative mb-5 aspect-[4/5] max-h-[460px] overflow-hidden rounded-[28px] bg-[#F3D9A5]/40">
            <Image src={portrait} alt="Portrait of Priyam Parashar" fill sizes="(max-width: 1024px) 92vw, 36vw" className="object-contain object-center" />
          </div>
          {education.length ? (
            <div className="rounded-[24px] bg-[#F8F1E7] p-5 sm:p-6">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#C98F8F]">Education</p>
              <ul className="mt-4 space-y-4">
                {education.map((item) => {
                  const detail = publicDetail(item.detail);
                  return (
                    <li key={`${item.institution}-${item.start || ""}`}>
                      <h3 className="font-display text-3xl text-[#3B241C]">{item.institution}</h3>
                      {item.credential ? <p className="mt-1 text-sm uppercase tracking-[0.16em] text-[#3B241C]/70">{item.credential}</p> : null}
                      <p className="mt-2 text-sm text-[#3B241C]/75">{[item.start, item.end].filter(Boolean).join(" — ")}</p>
                      {detail ? <p className="mt-1 text-sm text-[#3B241C]">{detail}</p> : null}
                      {item.location ? <p className="mt-1 text-sm text-[#3B241C]/70">{item.location}</p> : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
        {strengths.length ? (
          <div className="grid gap-3 sm:grid-cols-3 lg:col-span-12">
            {strengths.map((item) => (
              <article key={item.title} className="rounded-[24px] border border-[#3B241C]/10 bg-[#F8F1E7] p-5">
                <h3 className="font-display text-2xl text-[#3B241C]">{item.title}</h3>
                {item.detail ? <p className="mt-2 text-sm leading-6 text-[#3B241C]/75">{item.detail}</p> : null}
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
