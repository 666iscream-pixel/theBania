"use client";

import { useState } from "react";

export type Occasion = { title: string; text: string; img: string };

// Lista okazji z podmianą zdjęcia — akcent bez dodatkowych ikon.
export function Occasions({ items }: { items: Occasion[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] lg:aspect-auto lg:min-h-[480px]">
        {items.map((o, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={o.img}
            src={`/img/${o.img}.jpg`}
            alt={o.title}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${i === active ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}
          />
        ))}
      </div>
      <div className="flex flex-col justify-center">
        <p className="font-hand text-3xl text-moss">Dla kogo</p>
        <h2 className="font-display text-4xl sm:text-5xl">Na każdą okazję.</h2>
        <ul className="mt-8 space-y-2">
          {items.map((o, i) => (
            <li key={o.title}>
              <button
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={`w-full rounded-2xl border-l-4 px-5 py-4 text-left transition ${
                  i === active ? "border-ember bg-peach" : "border-transparent hover:bg-peach/50"
                }`}
              >
                <span className={`block font-display text-2xl transition ${i === active ? "text-ink" : "text-ink/70"}`}>{o.title}</span>
                <span className={`mt-1 block text-muted transition ${i === active ? "opacity-100" : "opacity-80"}`}>{o.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
