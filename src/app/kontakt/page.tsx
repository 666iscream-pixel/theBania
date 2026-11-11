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
          <a href={CONFIG.googleMaps} target="_blank" rel="noreferrer" className="group relative block overflow-hidden rounded-[2rem]">
            <iframe
              title="Mapa — The Bania Wrocław"
              className="pointer-events-none h-72 w-full border-0"
              loading="lazy"
              src="https://www.google.com/maps?q=Rakietowa+21,+54-615+Wroc%C5%82aw&output=embed"
            />
            <span className="absolute bottom-4 left-4 rounded-full bg-ink px-4 py-2 text-sm font-bold text-peach shadow-lg transition group-hover:bg-wood-dark">
              Otwórz w Google Maps · opinie →
            </span>
          </a>
        </div>
        <ContactForm />
      </div>
    </PageShell>
  );
}
