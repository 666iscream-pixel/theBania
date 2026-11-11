import Link from "next/link";
import { CONFIG } from "@/lib/config";
import { Logo } from "./Logo";
import { Socials } from "./Socials";
import { StickyBook } from "./StickyBook";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink text-cream">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo size={112} light />
          <p className="mt-4 max-w-xs text-sm text-cream/70">Bania opalana drewnem, wynajem na wyłączność. Twoje miejsce na reset — tylko dla Ciebie i Twoich bliskich.</p>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-display text-lg">Kontakt</div>
          <p className="text-cream/80">{CONFIG.address}</p>
          <a href={CONFIG.phoneHref} className="mt-1 block font-semibold hover:underline">{CONFIG.phone}</a>
          <p className="mt-1 text-cream/60">Codziennie 12:00–00:00</p>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-display text-lg">Strona</div>
          <ul className="space-y-1.5 text-cream/80">
            <li><Link href="/rezerwacja" className="hover:text-cream hover:underline">Rezerwacja online</Link></li>
            <li><Link href="/cennik" className="hover:text-cream hover:underline">Cennik</Link></li>
            <li><Link href="/galeria" className="hover:text-cream hover:underline">Galeria</Link></li>
            <li><Link href="/regulamin" className="hover:text-cream hover:underline">Regulamin i FAQ</Link></li>
            <li><Link href="/praca" className="hover:text-cream hover:underline">Praca</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-display text-lg">Obserwuj nas</div>
          <Socials tone="light" />
          <a href={CONFIG.googleMaps} target="_blank" rel="noreferrer" className="mt-3 block text-cream/70 hover:text-cream hover:underline">Zostaw opinię w Google →</a>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="wrap flex flex-wrap justify-between gap-2 pb-24 pt-5 text-xs text-cream/50 lg:pb-5">
          <span>© 2026 The Bania Wrocław</span>
          <span>Polityka prywatności · Regulamin rezerwacji</span>
        </div>
      </div>
      <StickyBook />
    </footer>
  );
}
