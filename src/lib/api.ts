import type {
  About,
  ApiSuccess,
  Blog,
  Experience,
  HomeContent,
  Project,
  Service,
  Skill,
  Testimonial,
} from "@/lib/types";
import { publicDetail } from "@/lib/format";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function readJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  const body = (await response.json().catch(() => null)) as ApiSuccess<T> | null;

  if (!response.ok || !body?.success) {
    throw new ApiRequestError(response.status, body?.message || "The portfolio could not be reached.");
  }

  return body.data;
}

function withoutPrivateProfile(about: About | null) {
  if (!about) return about;
  const education = about.profileData?.education?.map((item) => ({
    ...item,
    detail: publicDetail(item.detail),
  }));
  const rest = { ...about };
  delete rest.phone;
  return {
    ...rest,
    profileData: about.profileData ? { ...about.profileData, education } : about.profileData,
  };
}

export async function getAbout() {
  return withoutPrivateProfile(await readJson<About | null>("/about"));
}

export function getSkills() {
  return readJson<Skill[]>("/skills");
}

export function getProjects() {
  return readJson<Project[]>("/projects");
}

export async function getProject(slug: string) {
  const response = await fetch(`${API_BASE}/projects/${encodeURIComponent(slug)}`, { cache: "no-store" });

  if (response.status === 404) return null;

  const body = (await response.json().catch(() => null)) as ApiSuccess<Project> | null;
  if (!response.ok || !body?.success) {
    throw new ApiRequestError(response.status, body?.message || "The project could not be reached.");
  }

  return body.data;
}

export function getBlogs() {
  return readJson<Blog[]>("/blogs");
}

export async function getBlog(slug: string) {
  const response = await fetch(`${API_BASE}/blogs/${encodeURIComponent(slug)}`, { cache: "no-store" });

  if (response.status === 404) return null;

  const body = (await response.json().catch(() => null)) as ApiSuccess<Blog> | null;
  if (!response.ok || !body?.success) {
    throw new ApiRequestError(response.status, body?.message || "The article could not be reached.");
  }

  return body.data;
}

export function getExperience() {
  return readJson<Experience[]>("/experience");
}

export function getTestimonials() {
  return readJson<Testimonial[]>("/testimonials");
}

export function getServices() {
  return readJson<Service[]>("/services");
}

async function settle<T>(label: string, request: Promise<T>, fallback: T, failed: string[]) {
  try {
    return await request;
  } catch {
    failed.push(label);
    return fallback;
  }
}

export async function loadHome(): Promise<HomeContent> {
  const failed: string[] = [];
  const [about, skills, projects, blogs, experience, testimonials, services] = await Promise.all([
    settle("about", getAbout(), null, failed),
    settle("skills", getSkills(), [], failed),
    settle("projects", getProjects(), [], failed),
    settle("writing", getBlogs(), [], failed),
    settle("experience", getExperience(), [], failed),
    settle("testimonials", getTestimonials(), [], failed),
    settle("services", getServices(), [], failed),
  ]);

  return { about, skills, projects, blogs, experience, testimonials, services, failed };
}
