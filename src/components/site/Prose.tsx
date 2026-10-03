export function Prose({ text }: { text?: string | null }) {
  if (!text?.trim()) return null;
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5">
      {blocks.map((block, index) => (
        <p key={`${index}-${block.slice(0, 24)}`} className="whitespace-pre-line text-base leading-8 text-[#3B241C]/80 sm:text-lg">
          {block}
        </p>
      ))}
    </div>
  );
}
