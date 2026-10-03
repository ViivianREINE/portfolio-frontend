import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prose } from "@/components/site/Prose";
import { getProject, getProjects } from "@/lib/api";
import { framingNote, isHttpUrl, mediaUrl, siteUrl } from "@/lib/format";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug).catch(() => null);
  if (!project) return { title: "Project not found" };

  const description = project.shortDescription || project.description || project.title;
  const image = mediaUrl(project.coverImage?.publicUrl);
  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description,
      url: `${siteUrl()}/projects/${project.slug}`,
      type: "article",
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug).catch(() => null);
  if (!project) notFound();

  const cover = mediaUrl(project.coverImage?.publicUrl);
  const github = isHttpUrl(project.githubUrl) ? project.githubUrl : null;
  const live = isHttpUrl(project.projectUrl) ? project.projectUrl : null;
  const story = [project.description, project.shortDescription].filter(Boolean).join("\n\n");
  const note = framingNote(project.slug, story);
  const others = (await getProjects().catch(() => [])).filter((item) => item.slug !== project.slug && item.published !== false).slice(0, 3);

  return (
    <article className="px-5 pb-20 pt-28 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1100px]">
        <Link href="/#work" className="text-[11px] uppercase tracking-[0.2em] text-[#C98F8F]">
          Back to work
        </Link>
        <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-[#C94C4C]">{project.featured ? "Featured project" : "Project"}</p>
        <h1 className="mt-4 font-display text-5xl leading-[0.95] text-[#3B241C] sm:text-7xl">{project.title}</h1>
        {project.shortDescription ? <p className="mt-6 max-w-2xl text-lg leading-8 text-[#3B241C]/75">{project.shortDescription}</p> : null}
        {project.stack?.length ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li key={item} className="rounded-full bg-[#E8D8C8] px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.18em]">
          {github ? (
            <a href={github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          ) : null}
          {live ? (
            <a href={live} target="_blank" rel="noreferrer">
              Live demo
            </a>
          ) : null}
        </div>
        {cover ? (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[32px]">
            <Image src={cover} alt={`${project.title} cover`} fill priority sizes="(max-width: 1100px) 92vw, 1100px" className="object-cover" />
          </div>
        ) : null}
        <div className="mt-10 max-w-3xl">
          <h2 className="font-display text-3xl text-[#3B241C]">Description</h2>
          <div className="mt-5">
            <Prose text={project.description} />
          </div>
          {!project.description ? <p className="mt-5 text-[#3B241C]/70">A longer description has not been published for this project.</p> : null}
          {note ? <p className="mt-6 text-sm leading-6 text-[#3B241C]/70">{note}</p> : null}
        </div>
        {others.length ? (
          <div className="mt-16 border-t border-[#3B241C]/10 pt-8">
            <h2 className="font-display text-3xl">Continue</h2>
            <ul className="mt-4 space-y-3">
              {others.map((item) => (
                <li key={item.id}>
                  <Link href={`/projects/${item.slug}`} className="font-display text-2xl">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}
