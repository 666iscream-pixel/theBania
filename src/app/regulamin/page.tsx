import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Art, type ArtName } from "@/components/Art";
import { BRING, CONFIG, INCLUDED } from "@/lib/config";

export const metadata = {
  title: "Regulamin i FAQ — The Bania Wrocław",
  description: "Zasady rezerwacji i zadatku, regulamin bani i gorącej beczki oraz odpowiedzi na najczęstsze pytania.",
};

const SECTIONS = [
  { id: "rezerwacja", label: "Rezerwacja i zadatek" },
  { id: "bania", label: "Regulamin bani" },
  { id: "balia", label: "Regulamin gorącej beczki" },
  { id: "faq", label: "Częste pytania" },
];

// Najważniejsze zasady rezerwacji — krótko, do szybkiego przeczytania
const BOOKING: { k: string; v: string }[] = [
  { k: "Zadatek", v: `${CONFIG.deposit} zł przy każdej rezerwacji. Online płacisz od razu (BLIK, Przelewy24, karta). Przy rezerwacji telefonicznej dostajesz SMS z linkiem — masz 1 godzinę na wpłatę.` },
  { k: "Zwrot zadatku", v: "Zadatek jest bezzwrotny — gwarantuje, że termin czeka tylko na Was." },
  { k: "Reszta płatności", v: "Pozostałą kwotę płacisz na miejscu, w dniu wizyty." },
  { k: "Czas wizyty", v: "Minimum 2 godziny, codziennie od 12:00. Wizyta kończy się najpóźniej o 00:00." },
  { k: "Liczba gości", v: `Cena obejmuje do 6 osób. Maksymalnie ${CONFIG.maxGuests} osób — dopłata ${CONFIG.extraGuestPerHour} zł/h za każdą kolejną, liczona na miejscu.` },
  { k: "Rezerwacja na dziś", v: "Potrzebujemy czasu na rozpalenie pieca: zwykle 2,5 godziny przed wizytą, a jeśli bania jest już rozgrzana po wcześniejszych gościach — 1,5 godziny." },
];

// Treść z relacji „Regulamin” na Instagramie
const BANIA = [
  "Przed wejściem do bani weź ciepły prysznic bez mydła.",
  "Aby chronić głowę przed przegrzaniem, pozostaw włosy suche i załóż czapeczkę kąpielową.",
  "Po wejściu do łaźni parowej zamykaj drzwi za sobą.",
  "Na ławce siedzimy tylko i wyłącznie na ręczniku.",
  "Nie można wnosić jedzenia oraz napojów do łaźni parowej.",
  "Zabrania się polewania kamieni czymkolwiek innym niż ciepłą wodą.",
  "Na terenie całego obiektu obowiązuje strefa ciszy. Szanujmy sąsiadów.",
  "Wszystkie zniszczenia trzeba niezwłocznie zgłosić obsłudze.",
  "W miarę możliwości pozostaw po sobie porządek.",
];

const BALIA = [
  "Przed wejściem do beczki weź ciepły prysznic bez mydła.",
  "Zabrania się wskakiwania do beczki.",
  "Prosimy nie zabierać do beczki czapek do bani i ręczników.",
  "Do korzystania z beczki obowiązuje strój kąpielowy.",
  "Zabrania się zabierania jedzenia do beczki.",
  "Napoje prosimy trzymać poza lustrem wody.",
  "Zabrania się palenia w beczce.",
  "Na terenie całego obiektu obowiązuje strefa ciszy.",
  "Prosimy o zadbanie o czystość wody.",
];

// Pierwsze odpowiedzi — z relacji „Q&A” na Instagramie
const FAQ: { q: string; a: React.ReactNode }[] = [
  { q: "Co jest wliczone w cenę?", a: `${INCLUDED.join(", ")}.` },
  { q: "Co trzeba zabrać ze sobą?", a: `${BRING.join(", ").replace("*", "")} — strój kąpielowy, jeśli zamierzają Państwo korzystać z gorącej beczki.` },
  { q: "Czy można przynosić swoje napoje oraz jedzenie?", a: "Można. Pamiętajmy jednak, że spożywanie alkoholu jest bardzo szkodliwe dla zdrowia." },
  { q: "Czy jest strefa do grillowania?", a: "Tak. Korzystanie z grilla we własnym zakresie jest bezpłatne, a na życzenie rozpalimy grill i zapewnimy węgiel (40 zł)." },
  { q: "Czy gorącą beczkę można zarezerwować osobno?", a: "Nie, beczka jest dodatkiem do rezerwacji bani — minimum 2 godziny." },
  {
    q: "Dlaczego w kalendarzu nie widzę niektórych godzin?",
    a: "W sezonie (wrzesień–marzec) układamy rezerwacje tak, by między nimi nie zostawały krótkie okna, których nikt nie może zarezerwować. Dzięki temu więcej gości znajduje wolny termin.",
  },
  {
    q: "Ile kosztuje wizyta?",
    a: (
      <>
        Od {CONFIG.prices.weekday} zł za godzinę w tygodniu i {CONFIG.prices.weekend} zł w weekendy, od 3. godziny −50%. Szczegóły w{" "}
        <Link href="/cennik" className="font-semibold underline underline-offset-2">cenniku</Link>.
      </>
    ),
  },
];

export default function Regulamin() {
  return (
    <PageShell art="hourglass" eyebrow="Zasady" title="Regulamin i FAQ." intro="Wszystko, co warto wiedzieć przed wizytą — w jednym miejscu.">
      <div className="grid gap-10 lg:grid-cols-[230px_1fr] lg:gap-14">
        <nav aria-label="Spis treści" className="lg:sticky lg:top-28 lg:self-start">
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible">
            {SECTIONS.map((s) => (
              <li key={s.id} className="shrink-0">
                <a href={`#${s.id}`} className="block rounded-full bg-peach px-4 py-2 text-sm font-semibold transition hover:bg-sand hover:text-paper lg:rounded-xl lg:bg-transparent lg:px-3 lg:hover:bg-peach lg:hover:text-ink">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-16">
          <Section id="rezerwacja" art="bell" title="Rezerwacja i zadatek.">
            <dl className="divide-y divide-line rounded-[1.5rem] bg-paper ring-1 ring-line">
              {BOOKING.map((b) => (
                <div key={b.k} className="grid gap-1 p-5 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <dt className="font-bold">{b.k}</dt>
                  <dd className="text-muted">{b.v}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section id="bania" art="stove" title="Regulamin bani.">
            <Rules items={BANIA} />
          </Section>

          <Section id="balia" art="tub" title="Regulamin gorącej beczki.">
            <Rules items={BALIA} />
          </Section>

          <Section id="faq" art="teapot" title="Częste pytania.">
            <div className="divide-y divide-line rounded-[1.5rem] bg-paper ring-1 ring-line">
              {FAQ.map((f) => (
                <details key={f.q} className="group px-5 py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-bold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-peach text-lg transition group-open:rotate-45" aria-hidden>+</span>
                  </summary>
                  <p className="pb-5 text-muted">{f.a}</p>
                </details>
              ))}
            </div>
            <p className="mt-6 text-muted">
              Nie ma tu odpowiedzi? Zadzwoń: <a href={CONFIG.phoneHref} className="font-semibold text-ink underline underline-offset-2">{CONFIG.phone}</a> albo{" "}
              <Link href="/kontakt" className="font-semibold text-ink underline underline-offset-2">napisz do nas</Link>.
            </p>
          </Section>
        </div>
      </div>
    </PageShell>
  );
}

function Section({ id, art, title, children }: { id: string; art: ArtName; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="mb-6 flex items-center gap-4">
        <Art name={art} className="h-14 w-14 shrink-0 object-contain" />
        <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Rules({ items }: { items: string[] }) {
  return (
    <ol className="space-y-3 rounded-[1.5rem] bg-paper p-5 ring-1 ring-line sm:p-7">
      {items.map((r, i) => (
        <li key={r} className="flex gap-3">
          <span className="w-6 shrink-0 pt-px text-right font-display text-lg text-sand">{i + 1}.</span>
          <span>{r}</span>
        </li>
      ))}
    </ol>
  );
}
