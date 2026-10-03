import type { MetadataRoute } from "next";
import { getBlogs, getProjects } from "@/lib/api";
import { siteUrl } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [projects, blogs] = await Promise.all([
    getProjects().catch(() => []),
    getBlogs().catch(() => []),
  ]);

  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...projects.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.8 : 0.6,
    })),
    ...blogs.map((blog) => ({
      url: `${base}/blog/${blog.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
