import { CONFIG } from "@/lib/config";

const ITEMS = [
  {
    href: CONFIG.instagram,
    label: "Instagram",
    path: "M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 4.6a5.2 5.2 0 1 0 0 10.4 5.2 5.2 0 0 0 0-10.4Zm0 8.6a3.4 3.4 0 1 1 0-6.8 3.4 3.4 0 0 1 0 6.8Zm5.4-9.9a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z",
  },
  {
    href: CONFIG.facebook,
    label: "Facebook",
    path: "M13.5 21.8v-8.1h2.7l.4-3.2h-3.1V8.5c0-.9.3-1.5 1.6-1.5h1.7V4.1c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.6v3.2h2.8v8.1h3.1Z",
  },
  {
    href: CONFIG.googleMaps,
    label: "Google Maps — opinie i dojazd",
    path: "M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.6A2.6 2.6 0 1 1 12 6.4a2.6 2.6 0 0 1 0 5.2Z",
  },
];

// Ikony mediów społecznościowych + wizytówka Google. `tone` dopasowuje kolory do tła.
export function Socials({ tone = "dark", size = 44 }: { tone?: "dark" | "light"; size?: number }) {
  const cls = tone === "light" ? "bg-cream/10 text-cream hover:bg-peach hover:text-ink" : "bg-ink text-peach hover:bg-wood-dark";
  return (
    <ul className="flex gap-2.5">
      {ITEMS.map((i) => (
        <li key={i.label}>
          <a
            href={i.href}
            target="_blank"
            rel="noreferrer"
            aria-label={i.label}
            title={i.label}
            className={`flex items-center justify-center rounded-full transition ${cls}`}
            style={{ width: size, height: size }}
          >
            <svg viewBox="0 0 24 24" width={size * 0.48} height={size * 0.48} fill="currentColor" aria-hidden>
              <path d={i.path} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}

// Wersja z opisami — na stronę kontakt, gdzie same ikony wyglądają zbyt skromnie.
export function SocialCards() {
  const subs = [
    `@the_bania_ · ${CONFIG.instagramFollowers} obserwujących`,
    "The Bania Wrocław · aktualności",
    `${CONFIG.googleRating} ★ · ${CONFIG.googleReviews} opinii — zostaw swoją`,
  ];
  const names = ["Instagram", "Facebook", "Google"];
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-[1.5rem] bg-paper ring-1 ring-line">
      {ITEMS.map((i, k) => (
        <li key={i.label}>
          <a href={i.href} target="_blank" rel="noreferrer" className="group flex items-center gap-4 px-5 py-4 transition hover:bg-peach/60">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-peach transition group-hover:bg-ember group-hover:text-white">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
                <path d={i.path} />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold">{names[k]}</span>
              <span className="block truncate text-sm text-muted">{subs[k]}</span>
            </span>
            <span className="text-lg transition group-hover:translate-x-1" aria-hidden>→</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
