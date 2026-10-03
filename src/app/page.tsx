import type { Metadata } from "next";
import { AboutSection } from "@/components/about/AboutSection";
import { AchievementsSection } from "@/components/achievements/AchievementsSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { Hero } from "@/components/hero/Hero";
import { NotesSection } from "@/components/notes/NotesSection";
import { PracticeSection } from "@/components/practice/PracticeSection";
import { WritingSection } from "@/components/writing/WritingSection";
import { SelectedWork } from "@/components/work/SelectedWork";
import { loadHome } from "@/lib/api";
import { siteUrl } from "@/lib/format";
import { profiles } from "@/lib/socials";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const content = await loadHome();
  const featured = content.projects.filter((project) => project.featured && project.published !== false);
  const more = content.projects.filter((project) => project.published !== false && !project.featured);
  const about = content.about;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Priyam Parashar",
    jobTitle: "Software Engineer & AI Systems Developer",
    description: about?.shortBio || undefined,
    email: about?.email || undefined,
    address: about?.location || undefined,
    url: siteUrl(),
    sameAs: profiles.map((profile) => profile.href),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {content.failed.length ? (
        <p className="mx-auto mt-24 max-w-[1440px] px-5 text-sm text-[#C94C4C] sm:px-8">
          Some sections could not be reached: {content.failed.join(", ")}.
        </p>
      ) : null}
      <Hero about={about} />
      <SelectedWork projects={featured} more={more} />
      <AboutSection about={about} />
      <ExperienceSection experience={content.experience} />
      <AchievementsSection achievements={about?.profileData?.achievements || []} />
      <PracticeSection
        skills={content.skills}
        services={content.services}
        testimonials={content.testimonials}
        volunteering={about?.profileData?.volunteering || []}
      />
      <WritingSection blogs={content.blogs} />
      <NotesSection />
      <ContactSection about={about} />
    </>
  );
}
