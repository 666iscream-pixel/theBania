import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Art, Dashes, Leaf, type ArtName } from "@/components/Art";
import { BRING, CONFIG, INCLUDED } from "@/lib/config";

export const metadata = { title: "Regulamin i FAQ — The Bania Wrocław" };

// Treść z relacji „Regulamin” na Instagramie
const BANIA = [
  "Przed wejściem do bani weź ciepły prysznic bez mydła",
  "Aby chronić głowę przed przegrzaniem, pozostaw włosy suche i załóż czapeczkę kąpielową",
  "Po wejściu do łaźni parowej zamykaj drzwi za sobą",
  "Na ławce siedzimy tylko i wyłącznie na ręczniku",
  "Nie można wnosić jedzenia oraz napojów do łaźni parowej",
  "Zabrania się polewania czymkolwiek kamieni, niż ciepłą wodą",
  "Na terenie całego obiektu obowiązuje strefa ciszy. Szanujmy sąsiadów ;)",
  "Wszystkie zniszczenia trzeba niezwłocznie zgłosić obsłudze",
  "W miarę możliwości pozostaw po sobie porządek",
];

const BALIA = [
  "Przed wejściem do balii weź ciepły prysznic bez mydła",
  "Zabrania się wskakiwania do balii",
  "Prosimy nie zabierać do środka balii czapek do bani i ręczników",
  "Do korzystania z balii obowiązuje kostium kąpielowy",
  "Zabrania się zabierania jedzenia do balii",
  "Napoje prosimy trzymać poza lustrem wody",
  "Zabrania się palenia w balii",
  "Na terenie całego obiektu obowiązuje strefa ciszy",
  "Prosimy o zadbanie o czystość wody ;)",
];

// Pierwsze cztery — z relacji „Q&A”, reszta — z ustaleń z właścicielem
const FAQ: { q: string; short?: string; a: string; photo?: string; art?: ArtName }[] = [
  { q: "Czy posiadamy strefę do grilowania?", short: "Tak, posiadamy.", a: "Na życzenie możemy rozpalić grilla oraz zapewnić węgiel (40 zł). Korzystanie z grilla we własnym zakresie jest bezpłatne.", photo: "/img/grill.jpg" },
  { q: "Czy można przynosić swoje napoje oraz jedzenie?", short: "Można.", a: "Pamiętajmy jednak, że spożywanie alkoholu jest bardzo szkodliwe dla waszego zdrowia.", photo: "/img/tea.jpg" },
  { q: "Czy zadatek jest zwrotny?", short: "Nie.", a: "Zadatek 200 zł jest bezzwrotny — gwarantuje, że termin czeka tylko na Was. Pozostałą kwotę płacicie na miejscu.", art: "hourglass" },
  { q: "Ile osób może przyjść?", short: "Do 12 osób.", a: `Cena obejmuje grupę do 6 osób. Za każdą kolejną osobę dopłata ${CONFIG.extraGuestPerHour} zł za godzinę — liczona na miejscu według faktycznej liczby gości.`, art: "lady" },
  { q: "Dlaczego nie widzę niektórych godzin?", short: "Żeby nikt nie tracił czasu.", a: "W sezonie (wrzesień–marzec) układamy rezerwacje tak, by między nimi nie zostawały krótkie okna, których nikt nie może zarezerwować. Dzięki temu więcej gości znajduje wolny termin.", art: "bell" },
  { q: "Czy mogę zarezerwować na dziś?", short: "Tak, jeśli zdążymy rozpalić.", a: "Zwykle 2,5 godziny przed wizytą. Jeśli tego dnia bania jest już rozgrzana po wcześniejszych gościach — wystarczy 1,5 godziny.", art: "stove" },
  { q: "Czy beczkę można zarezerwować osobno?", short: "Nie.", a: "Gorąca beczka jest dodatkiem do rezerwacji bani, minimum 2 godziny.", art: "tub" },
];

export default function Regulamin() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-x-clip">
        {/* REGULAMIN — deski jak w relacji */}
        <section className="planks py-16 lg:py-24">
          <div className="wrap">
            <h1 className="text-center font-marker text-6xl font-bold text-paper drop-shadow sm:text-7xl">Regulamin</h1>
            <div className="mx-auto mt-6 max-w-2xl rounded-3xl bg-ember/90 px-6 py-4 text-center text-paper shadow-lg">
              <span className="font-bold">Zadatek 200 zł jest bezzwrotny.</span> Rezerwację potwierdza jego wpłata — w razie odwołania wizyty zadatek nie podlega zwrotowi.
            </div>
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <RulesBoard title="Regulamin korzystania z bani" items={BANIA} art="venik" />
              <RulesBoard title="Regulamin korzystania z balii" items={BALIA} art="tub" />
            </div>
          </div>
        </section>

        {/* FAQ — jak relacje Q&A */}
        <section id="faq" className="relative scroll-mt-24 overflow-hidden bg-peach py-16 lg:py-24">
          <Dashes className="absolute right-[8%] top-12 w-36 text-moss" />
          <Leaf className="absolute -left-10 top-40 w-40 rotate-12 text-paper" />
          <Leaf className="absolute -right-10 bottom-24 w-44 -rotate-45 text-moss" />
          <div className="wrap relative">
            <div className="blob-a inline-block bg-sand px-10 py-10 sm:px-16">
              <h2 className="font-hand text-5xl leading-tight text-paper sm:text-6xl">
                Odpowiedzi na często
                <br />
                zadawane pytania.
              </h2>
            </div>

            <div className="mt-14 space-y-14">
              {FAQ.map((f, i) => (
                <div key={f.q} className={`grid items-center gap-8 md:grid-cols-[1fr_260px] ${i % 2 ? "md:grid-cols-[260px_1fr]" : ""}`}>
                  <div className={i % 2 ? "md:order-2" : ""}>
                    <h3 className={`font-hand text-4xl leading-tight sm:text-5xl ${i % 3 === 1 ? "blob-b inline-block bg-moss px-8 py-5 text-paper" : "text-moss"}`}>{f.q}</h3>
                    {f.short && <p className="mt-4 font-hand text-4xl text-moss">{f.short}</p>}
                    <p className="mt-2 max-w-xl font-hand text-2xl leading-snug text-moss/90">{f.a}</p>
                  </div>
                  <div className={`flex justify-center ${i % 2 ? "md:order-1" : ""}`}>
                    {f.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={f.photo} alt="" className={`${i % 2 ? "blob-c" : "blob-b"} aspect-square w-56 object-cover shadow-xl sm:w-64`} />
                    ) : (
                      f.art && <Art name={f.art} className="h-44 w-auto" />
                    )}
                  </div>
                </div>
              ))}

              <div className="grid gap-8 md:grid-cols-2">
                <div className="blob-b bg-paper/70 px-10 py-10">
                  <h3 className="font-hand text-5xl text-moss">Co trzeba zabrać ze sobą pod czas pobytu w Banie?</h3>
                  <ul className="mt-5 font-hand text-4xl text-moss">
                    {BRING.map((x) => <li key={x}>• {x}</li>)}
                  </ul>
                  <p className="mt-2 text-sm text-moss">* jeśli zamierzają Państwo korzystać z gorącej beczki</p>
                </div>
                <div className="blob-a bg-sand px-10 py-10">
                  <h3 className="font-hand text-5xl text-paper">Co jest wliczone w cenę.</h3>
                  <ul className="mt-5 font-hand text-3xl text-moss">
                    {INCLUDED.map((x) => <li key={x}>• {x};</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function RulesBoard({ title, items, art }: { title: string; items: string[]; art: ArtName }) {
  return (
    <div className="relative rounded-3xl bg-peach/95 p-6 shadow-2xl sm:p-10">
      <h2 className="text-center font-marker text-4xl font-bold uppercase leading-none sm:text-5xl">{title}</h2>
      <ol className="mt-8 space-y-4">
        {items.map((r, i) => (
          <li key={r} className="flex items-start gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-wood-dark text-xs font-bold text-peach">{String(i + 1).padStart(2, "0")}</span>
            <span className="pt-1 font-marker text-2xl font-bold uppercase leading-tight tracking-wide">{r}</span>
          </li>
        ))}
      </ol>
      <Art name={art} className="pointer-events-none absolute -bottom-6 -right-4 h-32 rotate-6 opacity-80 sm:h-40" />
    </div>
  );
}
