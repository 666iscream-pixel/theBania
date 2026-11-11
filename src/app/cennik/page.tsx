import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Art, type ArtName } from "@/components/Art";
import { BRING, CONFIG, INCLUDED } from "@/lib/config";

export const metadata = {
  title: "Cennik — The Bania Wrocław",
  description: "Ceny bani opalanej drewnem we Wrocławiu: od 200 zł/h za cały obiekt do 6 osób, gorąca beczka 150 zł/h, witki 50 zł. Od 3. godziny −50%.",
};

const { prices: P } = CONFIG;
const half = (n: number) => n * (1 - P.discount);

type Line = { name: string; note?: string; price: string };

const GROUPS: { id: string; art: ArtName; title: string; sub: string; lines: Line[]; foot?: string }[] = [
  {
    id: "bania",
    art: "stove",
    title: "Bania.",
    sub: "Cały obiekt na wyłączność, do 6 osób",
    lines: [
      { name: "Poniedziałek — czwartek", price: `${P.weekday} zł / godz.` },
      { name: "Piątek — niedziela i święta", price: `${P.weekend} zł / godz.` },
      { name: "Każda godzina od trzeciej", note: `${half(P.weekday)} zł w tygodniu, ${half(P.weekend)} zł w weekend`, price: "−50%" },
    ],
    foot: "Minimum 2 godziny, codziennie 12:00–00:00.",
  },
  {
    id: "beczka",
    art: "tub",
    title: "Gorąca beczka.",
    sub: "Woda 40°C, 20 dysz do hydromasażu",
    lines: [
      { name: "Godzina", price: `${P.tubPerHour} zł / godz.` },
      { name: "Każda godzina od trzeciej", note: `${half(P.tubPerHour)} zł`, price: "−50%" },
    ],
    foot: "Tylko jako dodatek do bani, minimum 2 godziny.",
  },
  {
    id: "dodatki",
    art: "venik",
    title: "Dodatki.",
    sub: "Do wyboru przy rezerwacji",
    lines: [
      { name: "Witki brzozowe", price: "50 zł / szt." },
      { name: "Witki dębowe", price: "50 zł / szt." },
      { name: "Witki eukaliptusowe", price: "50 zł / szt." },
      { name: "Grill", note: "rozpalanie we własnym zakresie", price: "0 zł" },
      { name: "Rozpalenie grilla + węgiel", note: "wszystkie narzędzia są na miejscu", price: "40 zł" },
      { name: "Ceremonia z parmistrzem", note: "sesja dla 1 gościa", price: "zapytaj" },
    ],
  },
  {
    id: "goscie",
    art: "lady",
    title: "Większa grupa.",
    sub: `Do ${CONFIG.maxGuests} osób`,
    lines: [{ name: "Każda osoba powyżej 6", note: "liczymy na miejscu według faktycznej liczby gości", price: `${CONFIG.extraGuestPerHour} zł / godz.` }],
  },
];

export default function Cennik() {
  return (
    <PageShell art="ladle" eyebrow="Oferta" title="Cennik." intro="Płacisz za cały obiekt, a nie za osobę. Bez ukrytych opłat.">
      <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
        <div className="min-w-0 space-y-12">
          {GROUPS.map((g) => (
            <section key={g.id} id={g.id} className="scroll-mt-28">
              <div className="mb-4 flex items-center gap-4">
                <Art name={g.art} className="h-14 w-14 shrink-0 object-contain" />
                <div>
                  <h2 className="font-display text-3xl">{g.title}</h2>
                  <p className="text-muted">{g.sub}</p>
                </div>
              </div>
              <ul className="divide-y divide-line rounded-[1.5rem] bg-paper ring-1 ring-line">
                {g.lines.map((l) => (
                  <li key={l.name} className="flex items-baseline justify-between gap-4 px-5 py-4">
                    <div>
                      <div className="font-semibold">{l.name}</div>
                      {l.note && <div className="text-sm text-muted">{l.note}</div>}
                    </div>
                    <div className="shrink-0 text-right font-display text-xl">{l.price}</div>
                  </li>
                ))}
              </ul>
              {g.foot && <p className="mt-3 text-sm text-muted">{g.foot}</p>}
            </section>
          ))}

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-paper p-6 ring-1 ring-line">
              <h2 className="font-display text-2xl">W cenie.</h2>
              <ul className="mt-3 space-y-1.5">
                {INCLUDED.map((x) => (
                  <li key={x} className="flex gap-2"><span className="text-moss">✓</span>{x}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.5rem] bg-paper p-6 ring-1 ring-line">
              <h2 className="font-display text-2xl">Zabierz ze sobą.</h2>
              <ul className="mt-3 space-y-1.5">
                {BRING.map((x) => (
                  <li key={x} className="flex gap-2"><span className="text-moss">•</span>{x.replace("*", "")}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-muted">Strój kąpielowy — jeśli korzystacie z gorącej beczki.</p>
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[1.5rem] bg-peach p-6">
            <h2 className="font-display text-xl">Przykład.</h2>
            <p className="mt-1 text-sm text-muted">4 godziny w sobotę, 6 osób</p>
            <dl className="mt-4 space-y-1.5 text-sm">
              <Calc l="1. i 2. godzina" r={`2 × ${P.weekend} zł`} />
              <Calc l="3. i 4. godzina (−50%)" r={`2 × ${half(P.weekend)} zł`} />
              <div className="flex justify-between border-t border-ink/15 pt-2 text-base font-bold">
                <dt>Razem</dt>
                <dd>{2 * P.weekend + 2 * half(P.weekend)} zł</dd>
              </div>
            </dl>
            <p className="mt-3 text-sm text-muted">+ gorąca beczka na 2 godziny: {2 * P.tubPerHour} zł</p>
          </div>
          <div className="rounded-[1.5rem] bg-ink p-6 text-cream">
            <h2 className="font-display text-xl">Zadatek {CONFIG.deposit} zł.</h2>
            <p className="mt-2 text-sm text-cream/75">Wpłacasz przy rezerwacji, resztę na miejscu. Zadatek jest bezzwrotny.</p>
            <Link href="/rezerwacja" className="mt-5 block rounded-full bg-peach py-3 text-center font-bold text-ink transition hover:bg-cream">
              Sprawdź wolne terminy
            </Link>
            <Link href="/regulamin#rezerwacja" className="mt-3 block text-center text-sm text-cream/70 underline underline-offset-2 hover:text-cream">
              Zasady rezerwacji
            </Link>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function Calc({ l, r }: { l: string; r: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt>{l}</dt>
      <dd className="font-semibold">{r}</dd>
    </div>
  );
}
