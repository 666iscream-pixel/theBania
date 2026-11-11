import { PageShell } from "@/components/PageShell";
import { Gallery } from "./Gallery";

const PHOTOS = [
  { src: "steam-light", alt: "Łaźnia parowa w promieniach słońca" },
  { src: "exterior", alt: "Budynek bani i ogród" },
  { src: "tub-evening", alt: "Gorąca beczka wieczorem" },
  { src: "lounge", alt: "Strefa relaksu" },
  { src: "witki", alt: "Witki dębowe" },
  { src: "steam-room", alt: "Łaźnia parowa" },
  { src: "garden-hammock", alt: "Hamak w ogrodzie" },
  { src: "tea", alt: "Herbata i owoce" },
  { src: "tub-night", alt: "Gorąca beczka nocą" },
  { src: "hero-steam", alt: "Piec i kamienie w bani" },
  { src: "citrus", alt: "Napar z cytrusów" },
  { src: "exterior-spring", alt: "Bania wiosną" },
  { src: "witki-back", alt: "Ceremonia z witkami" },
  { src: "lounge-2", alt: "Strefa wypoczynku z aneksem" },
  { src: "cold-plunge", alt: "Lód do zimnej kąpieli" },
  { src: "relax", alt: "Odpoczynek po bani" },
  { src: "tub-day", alt: "Gorąca beczka za dnia" },
  { src: "steam-room-2", alt: "Ławy w łaźni parowej" },
  { src: "grill", alt: "Strefa grillowania" },
  { src: "tea-2", alt: "Stół z herbatą" },
  { src: "lounge-3", alt: "Wnętrze strefy relaksu" },
  { src: "witki-towel", alt: "Przed ceremonią" },
  { src: "tub-glow", alt: "Podświetlona beczka" },
  { src: "steam-door", alt: "Wejście do łaźni" },
  { src: "spring-barrel", alt: "Zimna beczka w ogrodzie" },
  { src: "shower", alt: "Prysznic" },
  { src: "cold-barrel", alt: "Zimna beczka" },
];

export const metadata = { title: "Galeria — The Bania Wrocław" };

export default function Galeria() {
  return (
    <PageShell art="window" eyebrow="Galeria" title="Zajrzyj do środka." intro="Łaźnia parowa, gorąca beczka, strefa relaksu i ogród — tak wygląda u nas na co dzień.">
      <Gallery photos={PHOTOS} />
    </PageShell>
  );
}
