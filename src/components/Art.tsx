// Ryciny z postów The Bania (czarna kreska, przezroczyste tło).
export type ArtName =
  | "bell" | "hat" | "herbs" | "hot-guy" | "hourglass" | "ladle" | "lady"
  | "stove" | "teapot" | "tub" | "venik" | "window" | "peeling" | "tools" | "thermometer";

export function Art({ name, className = "", alt = "" }: { name: ArtName; className?: string; alt?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/art/${name}.png`} alt={alt} aria-hidden={alt ? undefined : true} className={`select-none ${className}`} draggable={false} />;
}

// Zielone „kreski” i liście jak w relacjach Q&A
export function Dashes({ className = "" }: { className?: string }) {
  const marks = [
    [10, 8], [34, 4], [58, 12], [22, 30], [46, 26], [70, 34], [8, 52], [34, 50], [60, 56], [84, 48], [20, 74], [48, 72], [74, 78], [94, 66],
  ];
  return (
    <svg viewBox="0 0 110 90" className={className} aria-hidden>
      {marks.map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} q 5 4 9 9`} stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
      ))}
    </svg>
  );
}

export function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      {[-60, -35, -10, 15, 40].map((r) => (
        <path key={r} d="M60 110 C 52 80, 50 45, 60 10 C 70 45, 68 80, 60 110 Z" fill="currentColor" transform={`rotate(${r} 60 110)`} />
      ))}
    </svg>
  );
}

// Nagłówek sekcji w stylu postów: rycina po lewej, gruby tytuł z kropką, podtytuł.
export function PostTitle({ art, title, sub, className = "" }: { art: ArtName; title: string; sub?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-5 sm:gap-8 ${className}`}>
      <Art name={art} className="h-24 w-auto shrink-0 sm:h-32" />
      <div>
        <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">{title}</h2>
        {sub && <p className="mt-2 text-lg text-muted">{sub}</p>}
      </div>
    </div>
  );
}
