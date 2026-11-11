"use client";

import { useCallback, useEffect, useState } from "react";
import { asset } from "@/lib/asset";

// Siatka zdjęć + podgląd na pełnym ekranie (strzałki, Esc, kliknięcie w tło).
export function Gallery({ photos }: { photos: { src: string; alt: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const move = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, move]);

  return (
    <>
      <div className="columns-2 gap-3 md:columns-3 lg:columns-4 lg:gap-4">
        {photos.map((p, i) => (
          <button key={p.src} onClick={() => setOpen(i)} className="group mb-3 block w-full overflow-hidden rounded-[1.5rem] lg:mb-4" aria-label={`Powiększ: ${p.alt}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(`/img/${p.src}.jpg`)} alt={p.alt} loading="lazy" className="w-full transition duration-500 group-hover:scale-105" />
          </button>
        ))}
      </div>
      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label={photos[open].alt} className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4" onClick={() => setOpen(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(`/img/${photos[open].src}.jpg`)} alt={photos[open].alt} className="max-h-[88vh] max-w-full rounded-2xl object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); move(-1); }} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-cream/90 px-4 py-3 text-xl font-bold text-ink" aria-label="Poprzednie zdjęcie">←</button>
          <button onClick={(e) => { e.stopPropagation(); move(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-cream/90 px-4 py-3 text-xl font-bold text-ink" aria-label="Następne zdjęcie">→</button>
          <button onClick={() => setOpen(null)} className="absolute right-4 top-4 rounded-full bg-cream/90 px-3.5 py-2 font-bold text-ink" aria-label="Zamknij">✕</button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-cream/80">{open + 1} / {photos.length}</p>
        </div>
      )}
    </>
  );
}
