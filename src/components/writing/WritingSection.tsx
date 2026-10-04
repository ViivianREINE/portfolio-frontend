import Image from "next/image";
import Link from "next/link";
import type { Blog } from "@/lib/types";
import { formatLongDate, mediaUrl } from "@/lib/format";

export function WritingSection({ blogs }: { blogs: Blog[] }) {
  const published = blogs.filter((blog) => blog.published !== false);
  if (!published.length) return null;

  return (
    <section className="scroll-mt-24 px-5 pb-12 sm:px-8 lg:px-12 lg:pb-14">
      <div className="mx-auto max-w-[1440px]">
        <h2 className="font-display text-3xl text-[#3B241C] sm:text-4xl">Essays</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
            {published.map((blog) => {
              const cover = mediaUrl(blog.coverImage?.publicUrl);
              const date = formatLongDate(blog.publishedAt || blog.createdAt);
              return (
                <article key={blog.id} className="overflow-hidden rounded-[24px] border border-[#3B241C]/10 bg-[#F8F1E7]">
                  {cover ? (
                    <div className="relative aspect-[16/9]">
                      <Image src={cover} alt="" fill sizes="(max-width: 768px) 92vw, 46vw" className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-1.5 bg-[#C98F8F]" />
                  )}
                  <div className="p-5 sm:p-6">
                    {date ? <p className="text-[11px] uppercase tracking-[0.18em] text-[#C98F8F]">{date}</p> : null}
                    <h3 className="mt-2 font-display text-3xl text-[#3B241C]">
                      <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h3>
                    {blog.excerpt ? <p className="mt-3 text-sm leading-6 text-[#3B241C]/75">{blog.excerpt}</p> : null}
                  </div>
                </article>
              );
            })}
        </div>
      </div>
    </section>
  );
}
