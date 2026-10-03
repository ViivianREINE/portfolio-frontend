import type { About } from "@/lib/types";
import { deskFooter } from "@/content/notes";
import { Logo } from "@/components/site/Logo";
import { profiles, SocialIcon } from "@/lib/socials";

export function SiteFooter({ about }: { about: About | null }) {
  return (
    <footer className="border-t border-[#3B241C]/10 px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-md text-sm text-[#3B241C]/65">{deskFooter}</p>
          {about?.location ? <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#3B241C]/45">{about.location}</p> : null}
        </div>
        <div className="flex flex-wrap gap-3">
          {profiles.map((profile) => (
            <a
              key={profile.id}
              href={profile.href}
              aria-label={profile.label}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#3B241C]/10 px-3 text-[11px] uppercase tracking-[0.16em] text-[#3B241C]/75"
            >
              <SocialIcon id={profile.id} />
              {profile.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
