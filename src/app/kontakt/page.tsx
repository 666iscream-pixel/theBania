import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Socials } from "@/components/Socials";
import { CONFIG } from "@/lib/config";
import { ContactForm } from "./ContactForm";

export const metadata = { title: "Kontakt — The Bania Wrocław" };

const ICON = {
  pin: "M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.6A2.6 2.6 0 1 1 12 6.4a2.6 2.6 0 0 1 0 5.2Z",
  phone: "M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z",
  clock: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 10.4 3.5 2-1 1.7L11 13.5V6h2v6.4Z",
};

// Kolejność: szybki kontakt → napisz wiadomość → mapa i dojazd
export default function Kontakt() {
  return (
    <PageShell art="bell" eyebrow="Kontakt" title="Zapraszamy." intro="Zadzwoń, napisz albo zarezerwuj online — wolne terminy widzisz od razu.">
      {/* 1. Szybki kontakt */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card icon="pin" label="Adres" value={CONFIG.address} action={{ href: CONFIG.googleMaps, text: "Wyznacz trasę", external: true }} />
        <Card icon="phone" label="Telefon" value={CONFIG.phone} action={{ href: CONFIG.phoneHref, text: "Zadzwoń" }} />
        <Card icon="clock" label="Godziny" value="Codziennie 12:00–00:00" note="Wyłącznie po rezerwacji" action={{ href: "/rezerwacja", text: "Zarezerwuj termin" }} />
      </div>

      {/* 2. Wiadomość */}
      <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
        <div>
          <h2 className="font-display text-4xl">Napisz do nas.</h2>
          <p className="mt-3 text-lg text-muted">Bon podarunkowy, większa grupa, wydarzenie firmowe albo po prostu pytanie — odpowiemy na e-mail najszybciej, jak to możliwe.</p>
          <p className="mt-4 text-muted">
            Chcesz zarezerwować termin? Najszybciej <Link href="/rezerwacja" className="font-semibold text-ink underline underline-offset-2">online</Link>.
          </p>
          <div className="mt-8">
            <p className="mb-3 font-hand text-2xl text-moss">Obserwuj nas</p>
            <Socials />
          </div>
        </div>
        <ContactForm />
      </div>

      {/* 3. Mapa z wizytówką Google — na końcu, jako „jak dojechać” */}
      <div className="mt-16 flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-4xl">Jak dojechać.</h2>
        <a href={CONFIG.googleMaps} target="_blank" rel="noreferrer" className="font-bold underline underline-offset-4 hover:no-underline">
          Opinie i trasa w Google Maps →
        </a>
      </div>
      <div className="mt-5 overflow-hidden rounded-[2rem] bg-paper ring-1 ring-line">
        <iframe title="The Bania na mapie Google" className="h-[360px] w-full border-0 lg:h-[440px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={CONFIG.mapEmbed} />
      </div>
    </PageShell>
  );
}

function Card({ icon, label, value, note, action }: { icon: keyof typeof ICON; label: string; value: string; note?: string; action: { href: string; text: string; external?: boolean } }) {
  const ext = action.external ? { target: "_blank", rel: "noreferrer" } : {};
  return (
    <div className="flex flex-col rounded-[1.75rem] bg-peach p-6">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-peach">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden><path d={ICON[icon]} /></svg>
      </span>
      <p className="mt-4 font-hand text-2xl text-moss">{label}</p>
      <p className="text-lg font-bold">{value}</p>
      {note && <p className="text-sm text-muted">{note}</p>}
      <a href={action.href} {...ext} className="mt-auto pt-5 font-bold underline underline-offset-4 hover:no-underline">
        {action.text} →
      </a>
    </div>
  );
}
