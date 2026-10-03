import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Great_Vibes, Inter } from "next/font/google";
import { CursorField } from "@/components/site/CursorField";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getAbout } from "@/lib/api";
import { siteUrl } from "@/lib/format";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#F8F1E7",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const base = siteUrl();
  let description = "Priyam Parashar is a software engineer and AI systems developer working across data, AI/ML, analytics, and software engineering.";
  let title = "Priyam Parashar — Software Engineer & AI Systems Developer";

  try {
    const about = await getAbout();
    if (about?.headline) title = `Priyam Parashar — ${about.headline}`;
    if (about?.shortBio) description = about.shortBio;
  } catch {
    description = "Priyam Parashar is a software engineer and AI systems developer working across data, AI/ML, analytics, and software engineering.";
  }

  return {
    metadataBase: new URL(base),
    title: { default: title, template: "%s — Priyam Parashar" },
    description,
    keywords: ["Priyam Parashar", "Software Engineer", "AI Systems Developer", "Data", "AI/ML", "Analytics", "Software Engineering"],
    openGraph: {
      title,
      description,
      url: base,
      siteName: "Priyam Portfolio",
      type: "website",
      images: [{ url: "/portraits/open.jpg", width: 736, height: 977, alt: "Illustrated portrait of Priyam Parashar" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/portraits/open.jpg"],
    },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  let about = null;
  try {
    about = await getAbout();
  } catch {
    about = null;
  }

  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${script.variable}`}>
      <body className="font-sans antialiased">
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <CursorField />
        <SiteHeader />
        <main id="content">{children}</main>
        <SiteFooter about={about} />
      </body>
    </html>
  );
}
