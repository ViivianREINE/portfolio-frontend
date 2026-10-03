import Link from "next/link";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const color = tone === "light" ? "text-[#F8F1E7]" : "text-[#3B241C]";

  return (
    <Link href="/" className={`inline-flex flex-col rounded-full px-1 py-1 ${color}`} aria-label="Priyam Portfolio">
      <span className="font-display text-[15px] leading-none tracking-[0.24em]">PRIYAM</span>
      <span className="mt-1 text-[9px] uppercase tracking-[0.34em] opacity-60">Portfolio</span>
    </Link>
  );
}
