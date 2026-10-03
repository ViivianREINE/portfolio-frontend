import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prose } from "@/components/site/Prose";
import { getBlog } from "@/lib/api";
import { formatLongDate, mediaUrl, siteUrl } from "@/lib/format";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug).catch(() => null);
  if (!blog) return { title: "Article not found" };

  const description = blog.excerpt || blog.title;
  const image = mediaUrl(blog.coverImage?.publicUrl);
  return {
    title: blog.title,
    description,
    alternates: { canonical: `/blog/${blog.slug}` },
    openGraph: {
      title: blog.title,
      description,
      type: "article",
      url: `${siteUrl()}/blog/${blog.slug}`,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug).catch(() => null);
  if (!blog) notFound();

  const cover = mediaUrl(blog.coverImage?.publicUrl);
  const date = formatLongDate(blog.publishedAt || blog.createdAt);

  return (
    <article className="px-5 pb-20 pt-28 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[860px]">
        <Link href="/#writing" className="text-[11px] uppercase tracking-[0.2em] text-[#C98F8F]">
          Back to writing
        </Link>
        {date ? <p className="mt-8 text-[11px] uppercase tracking-[0.2em] text-[#C94C4C]">{date}</p> : null}
        <h1 className="mt-4 font-display text-5xl leading-[0.95] text-[#3B241C] sm:text-7xl">{blog.title}</h1>
        {blog.excerpt ? <p className="mt-6 text-xl leading-8 text-[#3B241C]/75">{blog.excerpt}</p> : null}
        {cover ? (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[32px]">
            <Image src={cover} alt="" fill priority sizes="(max-width: 860px) 92vw, 860px" className="object-cover" />
          </div>
        ) : null}
        <div className="mt-10">
          <Prose text={blog.content} />
        </div>
      </div>
    </article>
  );
}
