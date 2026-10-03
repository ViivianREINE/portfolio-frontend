export const profiles = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/ViivianREINE",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/priyam-parashar-5b0b67273",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com/axon_nova.67",
    handle: "@axon_nova.67",
  },
  {
    id: "x",
    label: "X",
    href: "https://x.com/xoxo_preeam",
    handle: "@xoxo_preeam",
  },
] as const;

export function SocialIcon({ id }: { id: (typeof profiles)[number]["id"] }) {
  if (id === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
        <path d="M12 .5A11.5 11.5 0 0 0 .5 12.3c0 5.22 3.38 9.64 8.07 11.2.59.1.8-.26.8-.57v-2.2c-3.28.73-3.97-1.42-3.97-1.42-.54-1.38-1.3-1.75-1.3-1.75-1.07-.74.08-.73.08-.73 1.18.08 1.8 1.23 1.8 1.23 1.05 1.82 2.76 1.3 3.43.99.1-.77.41-1.3.75-1.6-2.62-.3-5.37-1.34-5.37-5.95 0-1.31.46-2.38 1.22-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.33 3.3 1.23a11.3 11.3 0 0 1 6 0c2.3-1.56 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.76.84 1.22 1.91 1.22 3.22 0 4.62-2.76 5.64-5.39 5.94.42.37.8 1.1.8 2.22v3.29c0 .31.21.68.81.57A11.51 11.51 0 0 0 23.5 12.3 11.5 11.5 0 0 0 12 .5Z" />
      </svg>
    );
  }

  if (id === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
        <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.84-2.1 3.79-2.1 4.05 0 4.8 2.67 4.8 6.14V24h-4v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.06V24h-4V8.5z" />
      </svg>
    );
  }

  if (id === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
        <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-3.2 1.7-4.8 4.9-4.9 1.2-.1 1.6-.1 4.8-.1Zm0 1.8c-3.1 0-3.5 0-4.7.1-2.2.1-3.2 1.1-3.3 3.3-.1 1.2-.1 1.6-.1 4.6s0 3.4.1 4.6c.1 2.2 1.1 3.2 3.3 3.3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c2.2-.1 3.2-1.1 3.3-3.3.1-1.2.1-1.6.1-4.6s0-3.4-.1-4.6c-.1-2.2-1.1-3.2-3.3-3.3-1.2-.1-1.6-.1-4.7-.1Zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8Zm0 1.8a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Zm6.3-2.3a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <path d="M18.2 2H21l-6.5 7.4L22 22h-6.2l-4.8-6.3L5.7 22H3l7-8L2 2h6.3l4.4 5.8L18.2 2Zm-1.1 18h1.7L7 3.8H5.2L17.1 20Z" />
    </svg>
  );
}

export function SocialRail({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const color = tone === "light" ? "border-[#F8F1E7]/25 text-[#F8F1E7]" : "border-[#3B241C]/15 text-[#3B241C]";

  return (
    <div className="flex items-center gap-3">
      {profiles.map((profile) => (
        <a
          key={profile.id}
          href={profile.href}
          aria-label={profile.label}
          target="_blank"
          rel="noreferrer"
          className={`grid h-11 w-11 place-items-center rounded-full border ${color}`}
        >
          <SocialIcon id={profile.id} />
        </a>
      ))}
    </div>
  );
}
