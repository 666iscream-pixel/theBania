import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Socials } from "@/components/Socials";
import { CONFIG } from "@/lib/config";
import { ContactForm } from "./ContactForm";

export const metadata = { title: "Kontakt — The Bania Wrocław" };

export default function Kontakt() {
  return (
    <PageShell art="bell" eyebrow="Kontakt" title="Zapraszamy." intro="Najszybciej zarezerwujesz online. Masz pytanie? Zadzwoń albo napisz — odpowiemy jak najszybciej.">
      <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
        <div className="flex flex-col gap-5">
          <div className="rounded-[2rem] bg-peach p-8">
            <dl className="space-y-5 text-lg">
              <div>
                <dt className="font-hand text-2xl text-moss">Adres</dt>
                <dd>{CONFIG.address}</dd>
              </div>
              <div>
                <dt className="font-hand text-2xl text-moss">Telefon</dt>
                <dd><a href={CONFIG.phoneHref} className="font-bold hover:underline">{CONFIG.phone}</a></dd>
              </div>
              <div>
                <dt className="font-hand text-2xl text-moss">Godziny</dt>
                <dd>Codziennie 12:00–00:00, wyłącznie po rezerwacji</dd>
              </div>
            </dl>
            <div className="mt-6 border-t-2 border-ink/10 pt-6">
              <p className="mb-3 font-hand text-2xl text-moss">Znajdziesz nas tu</p>
              <Socials />
            </div>
            <Link href="/rezerwacja" className="mt-7 inline-block rounded-full bg-ink px-6 py-3 font-bold text-peach transition hover:bg-wood-dark">
              Zarezerwuj online
            </Link>
          </div>
          <div className="overflow-hidden rounded-[2rem] bg-paper ring-1 ring-line">
            <iframe title="The Bania na mapie Google" className="h-80 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={CONFIG.mapEmbed} />
            <a href={CONFIG.googleMaps} target="_blank" rel="noreferrer" className="flex items-center justify-between px-5 py-4 font-bold transition hover:bg-peach">
              Opinie i dojazd w Google Maps <span aria-hidden>→</span>
            </a>
          </div>
        </div>
        <ContactForm />
      </div>
    </PageShell>
  );
}
