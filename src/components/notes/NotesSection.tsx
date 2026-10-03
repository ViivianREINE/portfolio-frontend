import { deskFooter, deskNotes } from "@/content/notes";

export function NotesSection() {
  return (
    <section id="notes" className="scroll-mt-24 px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#C98F8F]">07 / Notes</p>
        <h2 className="mt-3 font-display text-4xl leading-none text-[#3B241C] sm:text-5xl">Notes from the desk</h2>
        <p className="mt-3 max-w-xl font-display text-xl italic text-[#3B241C]/70 sm:text-2xl">
          small observations from building things, breaking things, and occasionally making them beautiful.
        </p>
        <div className="mt-8 divide-y divide-[#3B241C]/10 border-y border-[#3B241C]/10">
          {deskNotes.map((note) => (
            <article key={note.number} tabIndex={0} className="desk-note group grid gap-3 py-5 outline-none transition-colors duration-300 hover:bg-[#E8D8C8]/35 focus-within:bg-[#E8D8C8]/35 md:grid-cols-[220px_1fr] md:gap-10 md:py-6">
              <div>
                <p className="font-display text-3xl text-[#C98F8F] transition-colors duration-300 group-hover:text-[#C94C4C] group-focus-within:text-[#C94C4C]">
                  {note.number}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#3B241C]/60">{note.label}</p>
              </div>
              <div>
                <h3 className="max-w-3xl font-display text-3xl leading-tight text-[#3B241C] transition-transform duration-300 group-hover:translate-x-1 group-focus-within:translate-x-1 sm:text-4xl motion-reduce:transform-none">
                  {note.title}
                </h3>
                <div className="desk-rule mt-3 h-px bg-[#C98F8F]" />
                <p className="desk-body mt-4 max-w-2xl whitespace-pre-line text-base leading-7 text-[#3B241C]/80">{note.body}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm tracking-wide text-[#3B241C]/60">{deskFooter}</p>
      </div>
    </section>
  );
}
