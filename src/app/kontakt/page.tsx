import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { SocialCards } from "@/components/Socials";
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
    <PageShell art="bell" eyebrow="Kontakt" title="Zapraszamy." intro="Termin najszybciej zarezerwujesz online — wolne godziny widzisz od razu. Masz pytanie? Napisz albo zadzwoń.">
      {/* 1. Szybki kontakt */}
      <div className="grid divide-y divide-ink/10 rounded-[1.75rem] bg-peach md:grid-cols-3 md:divide-x md:divide-y-0">
        <Item icon="pin" label="Adres" value={CONFIG.address} action={{ href: CONFIG.googleMaps, text: "Wyznacz trasę", external: true }} />
        <Item icon="phone" label="Telefon" value={CONFIG.phone} action={{ href: CONFIG.phoneHref, text: "Zadzwoń" }} />
        <Item icon="clock" label="Godziny" value="Codziennie 12:00–00:00" action={{ href: "/rezerwacja", text: "Zarezerwuj termin" }} />
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
            <p className="mb-3 font-hand text-2xl text-moss">Znajdziesz nas też tu</p>
            <SocialCards />
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

function Item({ icon, label, value, action }: { icon: keyof typeof ICON; label: string; value: string; action: { href: string; text: string; external?: boolean } }) {
  const ext = action.external ? { target: "_blank", rel: "noreferrer" } : {};
  return (
    <div className="flex items-start gap-4 p-6">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-peach">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden><path d={ICON[icon]} /></svg>
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted">{label}</p>
        <p className="font-bold">{value}</p>
        <a href={action.href} {...ext} className="mt-1 inline-block text-sm font-semibold underline underline-offset-4 hover:no-underline">
          {action.text} →
        </a>
      </div>
    </div>
  );
}
