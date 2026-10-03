import Link from "next/link";

export default function NotFound() {
  return (
    <section className="px-5 pb-24 pt-36 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="font-script text-4xl text-[#C98F8F]">missing</p>
        <h1 className="mt-4 font-display text-6xl text-[#3B241C]">This page is not here.</h1>
        <p className="mt-5 max-w-lg text-[#3B241C]/75">The address does not match a published project, essay, or section.</p>
        <Link href="/" className="mt-8 inline-flex min-h-11 items-center rounded-full bg-[#3B241C] px-6 text-[11px] uppercase tracking-[0.18em] text-[#F8F1E7]">
          Return home
        </Link>
      </div>
    </section>
  );
}
