import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Art, Dashes, Leaf, PostTitle, type ArtName } from "@/components/Art";
import { Socials } from "@/components/Socials";
import { BRING, CONFIG, INCLUDED } from "@/lib/config";

// Kafelki w stylu postów edukacyjnych z Instagrama
const TILES: { art: ArtName; title: string; text: string }[] = [
  { art: "stove", title: "Bania — co to jest?", text: "Prawdziwa łaźnia parowa z piecem opalanym drewnem. Para jest miękka i głęboka." },
  { art: "window", title: "Tylko dla Was.", text: "Wynajmujecie cały obiekt: łaźnię, gorącą beczkę, strefę relaksu i ogród." },
  { art: "venik", title: "Witki.", text: "Brzozowe, dębowe lub eukaliptusowe. Zawsze doradzimy, jaki zestaw wybrać." },
  { art: "hourglass", title: "Wyczucie czasu.", text: "Minimum 2 godziny. Od trzeciej godziny każda kolejna jest o połowę tańsza." },
  { art: "hot-guy", title: "Schłodzenie.", text: "Po bani trzeba się schłodzić — zimna beczka na zewnątrz albo wiadro zimnej wody." },
  { art: "teapot", title: "Napoje i jedzenie.", text: "Herbata, kawa, miód i owoce są w cenie. Swoje jedzenie i napoje też możecie przynieść." },
];

const FACTS = [
  { k: "do 12", v: "osób na wyłączność" },
  { k: "40°C", v: "gorąca beczka, 20 dysz" },
  { k: "12–24", v: "codziennie" },
];

const STEPS = [
  { t: "Wybierz dzień i liczbę godzin", d: "Kalendarz pokaże tylko naprawdę wolne terminy." },
  { t: "Dodaj beczkę, witki, grill", d: "Cenę ze wszystkimi zniżkami liczymy od razu." },
  { t: "Wpłać zadatek 200 zł", d: "BLIK, Przelewy24 lub karta — termin jest Wasz." },
  { t: "Dostaniesz SMS i e-mail", d: "Potwierdzenie od razu, przypomnienie dzień przed." },
];

const GALLERY = [
  { src: "steam-light", alt: "Łaźnia parowa w promieniach słońca" },
  { src: "lounge", alt: "Strefa relaksu" },
  { src: "tub-day", alt: "Gorąca beczka" },
  { src: "citrus", alt: "Napar z cytrusów do bani" },
  { src: "exterior-spring", alt: "Budynek bani wiosną" },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-x-clip">
        {/* HERO */}
        <section className="bg-peach">
          <div className="wrap grid items-center gap-10 py-10 lg:grid-cols-[1.1fr_1fr] lg:py-14">
            <div>
              <p className="font-hand text-2xl text-moss sm:text-3xl">Wynajem na wyłączność · Wrocław</p>
              <h1 className="mt-2 font-display text-5xl leading-[1.02] sm:text-7xl">
                Bania opalana
                <br />
                drewnem.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted">
                Prawdziwa para, witki i gorąca beczka z hydromasażem. Cały obiekt tylko dla Was i Waszych bliskich.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href="/rezerwacja" className="rounded-full bg-ink px-7 py-3.5 font-bold text-peach shadow-lg transition hover:bg-wood-dark">
                  Zarezerwuj termin online
                </Link>
                <a href="#cennik" className="rounded-full border-2 border-ink px-6 py-3 font-bold transition hover:bg-ink hover:text-peach">
                  Cennik
                </a>
                <a href={CONFIG.phoneHref} className="px-2 text-sm font-semibold underline underline-offset-4">
                  {CONFIG.phone}
                </a>
              </div>
              <dl className="mt-9 grid max-w-lg grid-cols-3 gap-4 border-t-2 border-ink/10 pt-5">
                {FACTS.map((f) => (
                  <div key={f.v}>
                    <dt className="font-display text-2xl sm:text-3xl">{f.k}</dt>
                    <dd className="text-sm leading-tight text-muted">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-[480px]">
              <div className="blob-b absolute inset-[6%] translate-x-5 translate-y-4 bg-sand/70" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/tub-evening.jpg" alt="Gorąca beczka wieczorem" fetchPriority="high" className="blob-a absolute inset-[4%] h-[92%] w-[92%] object-cover shadow-2xl" />
              <Dashes className="absolute -right-1 top-0 w-24 text-moss sm:w-32" />
              <Leaf className="absolute -bottom-3 -left-4 w-24 -rotate-12 text-moss sm:w-32" />
              <Art name="hat" className="absolute -left-3 top-4 w-20 rotate-[-14deg] sm:w-28" />
            </div>
          </div>
        </section>

        {/* POSTY */}
        <section id="o-nas" className="wrap scroll-mt-24 py-20 lg:py-24">
          <p className="font-hand text-3xl text-moss">O nas</p>
          <h2 className="max-w-2xl font-display text-4xl leading-tight sm:text-5xl">Wszystko, czego potrzeba do dobrej ceremonii.</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {TILES.map((t) => (
              <article key={t.title} className="flex items-center gap-5 rounded-[2rem] bg-peach p-6 sm:min-h-52 sm:p-7">
                <Art name={t.art} className="h-24 w-20 shrink-0 object-contain sm:h-32 sm:w-24" />
                <div className="text-center">
                  <h3 className="font-display text-xl leading-tight sm:text-2xl">{t.title}</h3>
                  <p className="mt-2 text-[15px] leading-snug">{t.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CENNIK — jak w relacjach „Oferta” */}
        <section id="cennik" className="scroll-mt-24 bg-paper py-20 lg:py-24">
          <span id="oferta" className="block scroll-mt-24" />
          <div className="wrap">
            <PostTitle art="ladle" title="Oferta." sub="Tu mogą Państwo dowiedzieć się szczegółów naszej oferty." />
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              <PriceStory art="stove" title="Bania" foot={<Discount />}>
                <Day label="Poniedziałek — Czwartek" price={CONFIG.prices.weekday} />
                <Day label="Piątek — Niedziela i święta" price={CONFIG.prices.weekend} />
              </PriceStory>
              <PriceStory art="tub" title="Gorąca beczka" foot={<Discount />}>
                <Price value={CONFIG.prices.tubPerHour} unit="zł / godzina" />
                <p className="mt-2 font-semibold">Rezerwacja możliwa na co najmniej 2 godziny</p>
                <p className="mt-1 text-sm text-muted">Woda 40°C, 20 dysz do hydromasażu</p>
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
          </div>
        </section>

        {/* W CENIE / CO ZABRAĆ — jak relacje Q&A */}
        <section className="relative overflow-hidden bg-peach py-20 lg:py-24">
          <Dashes className="absolute right-[6%] top-8 w-28 text-moss" />
          <Leaf className="absolute -left-12 bottom-6 w-36 rotate-12 text-paper" />
          <div className="wrap relative grid gap-6 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-sand p-8 sm:p-10">
              <h2 className="font-hand text-5xl leading-tight text-paper">Co jest wliczone w cenę.</h2>
              <ul className="mt-5 grid grid-cols-1 gap-x-6 font-hand text-3xl text-paper sm:grid-cols-2">
                {INCLUDED.map((x) => (
                  <li key={x}>• {x}</li>
                ))}
              </ul>
              <Art name="teapot" className="pointer-events-none absolute -bottom-4 -right-4 h-32 opacity-25 invert" />
            </div>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-paper p-8 sm:p-10">
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

        {/* REZERWACJA */}
        <section className="wrap grid items-center gap-10 py-20 lg:grid-cols-[1fr_1.2fr] lg:py-24">
          <div>
            <PostTitle art="bell" title="Rezerwacja." sub="Bez dzwonienia — wolne terminy widzisz od razu, o każdej porze." />
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/rezerwacja" className="rounded-full bg-ink px-7 py-3.5 font-bold text-peach transition hover:bg-wood-dark">Sprawdź wolne terminy</Link>
              <a href={CONFIG.phoneHref} className="rounded-full border-2 border-ink px-6 py-3 font-bold">{CONFIG.phone}</a>
            </div>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {STEPS.map((s, i) => (
              <li key={s.t} className="flex gap-4 rounded-[1.5rem] bg-paper p-5 ring-1 ring-line">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-peach">{i + 1}</span>
                <div>
                  <div className="font-bold leading-snug">{s.t}</div>
                  <p className="mt-1 text-sm text-muted">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* GALERIA — bento */}
        <section className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-4xl sm:text-5xl">Zajrzyj do środka.</h2>
            <Link href="/galeria" className="font-bold underline underline-offset-4">Cała galeria →</Link>
          </div>
          <div className="mt-8 grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[220px] md:grid-cols-4 lg:gap-4">
            {GALLERY.map((g, i) => (
              <Link key={g.src} href="/galeria" className={`group overflow-hidden rounded-[1.75rem] ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/img/${g.src}.jpg`} alt={g.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ + KONTAKT */}
        <section className="wrap grid gap-5 py-20 md:grid-cols-2 lg:py-24">
          <Link href="/regulamin#faq" className="group relative flex min-h-80 flex-col overflow-hidden rounded-[2rem] bg-sand p-8 sm:p-10">
            <Dashes className="absolute right-6 top-6 w-20 text-paper/70" />
            <p className="max-w-xs font-hand text-5xl leading-tight text-paper">Odpowiedzi na często zadawane pytania.</p>
            <p className="mt-auto pt-6 font-bold text-paper">Regulamin i FAQ →</p>
            <Art name="hot-guy" className="absolute bottom-4 right-6 h-44 opacity-90 invert transition group-hover:-rotate-3 sm:h-52" />
          </Link>
          <div className="rounded-[2rem] bg-peach p-8 sm:p-10">
            <h2 className="font-display text-4xl">Kontakt.</h2>
            <p className="mt-4 text-lg">{CONFIG.address}</p>
            <a href={CONFIG.phoneHref} className="mt-1 block text-lg font-bold">{CONFIG.phone}</a>
            <p className="mt-1 text-muted">Codziennie 12:00–00:00, wyłącznie po rezerwacji.</p>
            <div className="mt-5">
              <Socials />
            </div>
            <iframe
              title="Mapa — The Bania Wrocław"
              className="mt-6 h-52 w-full rounded-2xl border-0"
              loading="lazy"
              src="https://www.google.com/maps?q=Rakietowa+21,+54-615+Wroc%C5%82aw&output=embed"
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function PriceStory({ art, title, foot, children }: { art: ArtName; title: string; foot?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#fde4cc] to-[#f6cfa9] p-7 text-center sm:p-8">
      <Art name={art} className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] -translate-x-1/2 -translate-y-1/2 opacity-[0.08]" />
      <div className="relative">
        <p className="font-hand text-2xl text-moss">Cennik</p>
        <h3 className="font-display text-3xl">{title}</h3>
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
