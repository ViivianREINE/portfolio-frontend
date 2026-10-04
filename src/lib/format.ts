import type { GalleryItem, Media, Skill } from "@/lib/types";

const employmentLabels: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  INTERNSHIP: "Internship",
};

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function isHttpUrl(value?: string | null): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function mediaUrl(publicUrl?: string | null) {
  return isHttpUrl(publicUrl) ? publicUrl : null;
}

export function coverFrom(record?: { coverImage?: Media | null; gallery?: GalleryItem[] } | null) {
  const direct = mediaUrl(record?.coverImage?.publicUrl);
  if (direct) return direct;
  const marked = record?.gallery?.find((item) => item.isCover)?.media?.publicUrl;
  const first = record?.gallery?.[0]?.media?.publicUrl;
  return mediaUrl(marked) || mediaUrl(first);
}

export function socialUrl(links: Record<string, string | null> | null | undefined, key: string) {
  const value = links?.[key];
  return typeof value === "string" && isHttpUrl(value) ? value : null;
}

export function employmentLabel(value?: string | null) {
  if (!value) return null;
  return employmentLabels[value] || value.replaceAll("_", " ").toLowerCase();
}

export function formatMonthYear(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

export function formatPeriod(start?: string | null, end?: string | null, current?: boolean) {
  const opening = formatMonthYear(start);
  const closing = current ? "Present" : formatMonthYear(end);
  if (opening && closing) return `${opening} — ${closing}`;
  return opening || closing || "";
}

export function formatLongDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

export function publicDetail(detail?: string | null) {
  if (!detail) return null;
  const next = detail.replace(/cgpa\s*[:\-]?\s*\d+(?:\.\d+)?/gi, "").replace(/\s{2,}/g, " ").trim();
  return next || null;
}

export function paragraphs(value?: string | null) {
  if (!value) return [];
  return value
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function groupSkills(skills: Skill[]) {
  const groups = new Map<string, Skill[]>();

  for (const skill of skills) {
    const category = skill.category?.trim() || "Practice";
    const current = groups.get(category) || [];
    const exists = current.some((item) => item.name.trim().toLowerCase() === skill.name.trim().toLowerCase());
    if (!exists) current.push(skill);
    groups.set(category, current);
  }

  return [...groups.entries()].map(([category, items]) => ({ category, items }));
}

export function framingNote(slug: string, text: string) {
  const normalized = text.toLowerCase();

  if (slug === "genescope-ai" && !normalized.includes("exploratory")) {
    return "GeneScope AI is an exploratory computational biology project. It is not a clinically validated diagnostic tool.";
  }

  if (slug === "navaura" && !/(clinical diagnosis|diagnostic service)/.test(normalized)) {
    return "NavAura is nutrition guidance. It is not offered as a clinical diagnostic service.";
  }

  return null;
}
