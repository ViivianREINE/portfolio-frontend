"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/site/Logo";

const links = [
  { href: "/#work", id: "work", label: "Work" },
  { href: "/#about", id: "about", label: "About" },
  { href: "/#experience", id: "experience", label: "Experience" },
  { href: "/#writing", id: "writing", label: "Writing" },
  { href: "/#contact", id: "contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [observed, setObserved] = useState("");
  const open = openPath === pathname;
  const active = pathname === "/" ? observed : "";

  useEffect(() => {
    if (openPath !== pathname) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPath(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [openPath, pathname]);

  useEffect(() => {
    if (pathname !== "/") return;

    const nodes = links
      .map((link) => document.getElementById(link.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setObserved(visible.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.15, 0.35, 0.6] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-3 sm:px-8 lg:px-12">
        <div className="rounded-full bg-[#F8F1E7]/85 px-3 py-1.5 backdrop-blur-md">
          <Logo />
        </div>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              aria-current={active === link.id ? "true" : undefined}
              className={`text-[11px] uppercase tracking-[0.22em] ${active === link.id ? "text-[#C94C4C]" : "text-[#3B241C]/75"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="rounded-full border border-[#3B241C]/15 bg-[#F8F1E7]/85 px-4 py-2 text-[11px] uppercase tracking-[0.22em] backdrop-blur-md lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpenPath(pathname)}
        >
          Menu
        </button>
      </div>
      {open ? (
        <div id="mobile-menu" className="fixed inset-0 z-50 bg-[#F8F1E7] lg:hidden">
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <Logo />
            <button
              type="button"
              className="rounded-full border border-[#3B241C]/15 px-4 py-2 text-[11px] uppercase tracking-[0.22em]"
              onClick={() => setOpenPath(null)}
            >
              Close
            </button>
          </div>
          <nav className="flex flex-col px-6 pt-6" aria-label="Mobile">
            {links.map((link, index) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setOpenPath(null)}
                className="border-b border-[#3B241C]/10 py-4 font-display text-4xl text-[#3B241C]"
              >
                <span className="mr-4 font-sans text-xs tracking-[0.2em] text-[#C98F8F]">0{index + 1}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
