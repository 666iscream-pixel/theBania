import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Art, Dashes, Leaf, type ArtName } from "@/components/Art";
import { BRING, CONFIG, INCLUDED } from "@/lib/config";

export const metadata = {
  title: "Cennik — The Bania Wrocław",
  description: "Ceny bani opalanej drewnem we Wrocławiu: od 200 zł/h do 6 osób, gorąca beczka 150 zł/h, witki 50 zł. Od 3. godziny −50%.",
};

// Karty w stylu relacji „Oferta” z Instagrama
export default function Cennik() {
  return (
    <PageShell art="ladle" eyebrow="Oferta" title="Cennik." intro="Tu mogą Państwo dowiedzieć się szczegółów naszej oferty. Cena za cały obiekt — bez obcych gości obok.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        <PriceStory art="stove" title="Bania" foot={<Discount />}>
          <Day label="Poniedziałek — Czwartek" price={CONFIG.prices.weekday} />
          <Day label="Piątek — Niedziela i święta" price={CONFIG.prices.weekend} />
        </PriceStory>
        <PriceStory art="tub" title="Gorąca beczka" foot={<Discount />}>
          <Price value={CONFIG.prices.tubPerHour} unit="zł / godzina" />
          <p className="mt-2 font-semibold">Rezerwacja możliwa na co najmniej 2 godziny</p>
          <p className="mt-1 text-sm text-muted">Woda 40°C, 20 dysz do hydromasażu. Tylko jako dodatek do bani.</p>
        </PriceStory>
        <PriceStory art="venik" title="Witki" foot={<Note>* Można wybrać dowolną ilość i rodzaj witek</Note>}>
          <Price value={50} unit="zł / szt." />
          <p className="mt-2 font-semibold">Brzozowe · Dębowe · Eukaliptusowe</p>
        </PriceStory>
        <PriceStory art="tools" title="Grill" foot={<Note>* Wszystkie niezbędne narzędzia są na miejscu</Note>}>
          <div className="mt-5 space-y-3">
            <Row l="Korzystanie z grilla" r="0 zł" />
            <Row l="Rozpalenie grilla + węgiel" r="40 zł" />
          </div>
        </PriceStory>
        <PriceStory art="lady" title="Dodatkowy gość" foot={<Note>* Liczymy na miejscu według faktycznej liczby gości</Note>}>
          <Price value={CONFIG.extraGuestPerHour} unit="zł / osoba / godz." />
          <p className="mt-2 font-semibold">Powyżej 6 osób, maksymalnie 12</p>
        </PriceStory>
        <div className="flex flex-col rounded-[2rem] bg-ink p-8 text-cream">
          <p className="font-hand text-3xl text-peach">Zadatek</p>
          <p className="font-display text-6xl">200 zł</p>
          <p className="mt-3 text-cream/80">Wpłacany przy rezerwacji, bezzwrotny. Resztę płacisz na miejscu.</p>
          <Link href="/rezerwacja" className="mt-auto self-start rounded-full bg-peach px-6 py-3 font-bold text-ink transition hover:bg-cream">
            Zarezerwuj
          </Link>
        </div>
      </div>

      {/* Przykład liczenia — to najczęstsze pytanie przy cenie za godzinę */}
      <div className="mt-5 rounded-[2rem] bg-paper p-7 ring-1 ring-line sm:p-8">
        <p className="font-hand text-2xl text-moss">Przykład</p>
        <p className="mt-1 text-lg">
          <b>4 godziny w sobotę:</b> 250 + 250 + 125 + 125 = <b>750 zł</b> za całą banię dla 6 osób. Z gorącą beczką na 2 godziny: + 300 zł.
        </p>
      </div>

      {/* W CENIE / CO ZABRAĆ — jak relacje Q&A */}
      <section className="relative mt-16 overflow-hidden rounded-[2.5rem] bg-peach px-5 py-12 sm:px-10 sm:py-16">
        <Dashes className="absolute right-[5%] top-6 w-24 text-moss" />
        <Leaf className="absolute -left-10 bottom-4 w-32 rotate-12 text-paper" />
        <div className="relative grid gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-[2rem] bg-sand p-8 sm:p-10">
            <h2 className="font-hand text-5xl leading-tight text-paper">Co jest wliczone w cenę.</h2>
            <ul className="mt-5 grid grid-cols-1 gap-x-6 font-hand text-3xl text-paper xl:grid-cols-2">
              {INCLUDED.map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
            <Art name="teapot" className="pointer-events-none absolute -bottom-4 -right-4 h-32 opacity-25 invert" />
          </div>
          <div className="relative overflow-hidden rounded-[2rem] bg-paper p-8 sm:p-10">
            <h2 className="font-hand text-5xl leading-tight text-moss">Co trzeba zabrać ze sobą?</h2>
            <ul className="mt-5 font-hand text-3xl text-moss">
              {BRING.map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-moss">* jeśli zamierzają Państwo korzystać z gorącej beczki</p>
            <Art name="hat" className="pointer-events-none absolute -bottom-4 -right-2 h-32 opacity-30" />
          </div>
        </div>
      </section>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-center">
        <Link href="/rezerwacja" className="rounded-full bg-ink px-8 py-4 font-bold text-peach transition hover:bg-wood-dark">Sprawdź wolne terminy</Link>
        <Link href="/regulamin#faq" className="rounded-full border-2 border-ink px-7 py-3.5 font-bold">Pytania i regulamin</Link>
      </div>
    </PageShell>
  );
}

function PriceStory({ art, title, foot, children }: { art: ArtName; title: string; foot?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#fde4cc] to-[#f6cfa9] p-7 text-center sm:p-8">
      <Art name={art} className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] -translate-x-1/2 -translate-y-1/2 opacity-[0.08]" />
      <div className="relative">
        <p className="font-hand text-2xl text-moss">Cennik</p>
        <h2 className="font-display text-3xl">{title}</h2>
        {children}
      </div>
      {foot && <div className="relative mt-auto pt-6">{foot}</div>}
    </div>
  );
}

function Price({ value, unit }: { value: number; unit: string }) {
  return (
    <p className="mt-5">
      <span className="font-display text-5xl">{value}</span> <span className="font-semibold">{unit}</span>
    </p>
  );
}

function Day({ label, price }: { label: string; price: number }) {
  return (
    <div className="mt-5">
      <div className="text-sm font-bold uppercase underline underline-offset-4">{label}</div>
      <p className="mt-1">
        <span className="font-display text-4xl">{price}</span> <span className="font-semibold">zł / godz.</span>
      </p>
      <p className="text-sm text-muted">do 6 osób</p>
    </div>
  );
}

function Row({ l, r }: { l: string; r: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-ink/10 pb-2 text-left">
      <span className="font-semibold">{l}</span>
      <span className="font-display text-2xl">{r}</span>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-wide">{children}</p>;
}

function Discount() {
  return (
    <div>
      <Note>* Po drugiej godzinie rezerwacji każda kolejna godzina</Note>
      <p className="mt-1 text-2xl font-extrabold">ZNIŻKA 50%</p>
    </div>
  );
}
