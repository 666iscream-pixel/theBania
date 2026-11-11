import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Art, Dashes, Leaf, PostTitle, type ArtName } from "@/components/Art";
import { Socials } from "@/components/Socials";
import { NextSlot } from "@/components/NextSlot";
import { CONFIG } from "@/lib/config";

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
  { k: "od 200 zł", v: "za godzinę, cały obiekt" },
  { k: "do 12", v: "osób na wyłączność" },
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
                <Link href="/rezerwacja" className="rounded-full bg-ember px-7 py-4 font-bold text-white shadow-lg shadow-ember/30 transition hover:-translate-y-0.5 hover:bg-[#c71f1a]">
                  Sprawdź wolne terminy →
                </Link>
                <Link href="/cennik" className="rounded-full border-2 border-ink px-6 py-3 font-bold transition hover:bg-ink hover:text-peach">
                  Cennik
                </Link>
                <a href={CONFIG.phoneHref} className="px-2 text-sm font-semibold underline underline-offset-4">
                  {CONFIG.phone}
                </a>
              </div>
              <div className="mt-4">
                <NextSlot />
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

        {/* REZERWACJA — kroki po lewej w kolumnie, nagłówek i przyciski po prawej */}
        <section className="wrap grid items-center gap-10 py-20 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:py-24">
          <div className="lg:order-2">
            <PostTitle art="bell" title="Rezerwacja." sub="Bez dzwonienia — wolne terminy widzisz od razu, o każdej porze." />
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/rezerwacja" className="rounded-full bg-ember px-7 py-3.5 font-bold text-white shadow-lg shadow-ember/25 transition hover:-translate-y-0.5 hover:bg-[#c71f1a]">Sprawdź wolne terminy →</Link>
              <a href={CONFIG.phoneHref} className="rounded-full border-2 border-ink px-6 py-3 font-bold">{CONFIG.phone}</a>
            </div>
          </div>
          <ol className="relative lg:order-1">
            <span className="absolute bottom-6 left-[19px] top-6 w-0.5 bg-ink/15" aria-hidden />
            {STEPS.map((s, i) => (
              <li key={s.t} className="relative flex gap-5 pb-7 last:pb-0">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink font-bold text-peach">{i + 1}</span>
                <div className="pt-1.5">
                  <div className="text-lg font-bold leading-snug">{s.t}</div>
                  <p className="mt-1 text-muted">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* GALERIA — bento */}
        <section className="wrap">
          <h2 className="font-display text-4xl sm:text-5xl">Zajrzyj do środka.</h2>
          <div className="mt-8 grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[220px] md:grid-cols-4 lg:gap-4">
            {GALLERY.map((g, i) => (
              <Link key={g.src} href="/galeria" className={`group overflow-hidden rounded-[1.75rem] ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/img/${g.src}.jpg`} alt={g.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/galeria" className="inline-block rounded-full border-2 border-ink px-7 py-3 font-bold transition hover:bg-ink hover:text-peach">
              Cała galeria →
            </Link>
          </div>
        </section>

        {/* FAQ — pasek */}
        <section className="wrap pt-20 lg:pt-24">
          <Link href="/regulamin#faq" className="group relative flex flex-col gap-4 overflow-hidden rounded-[2rem] bg-sand px-8 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <Dashes className="absolute right-[38%] top-4 hidden w-16 text-paper/60 sm:block" />
            <p className="font-hand text-4xl leading-tight text-paper sm:text-5xl">Odpowiedzi na często zadawane pytania.</p>
            <span className="relative shrink-0 self-start rounded-full bg-paper px-6 py-3 font-bold text-ink transition group-hover:bg-ink group-hover:text-peach sm:self-auto">
              Regulamin i FAQ →
            </span>
          </Link>
        </section>

        {/* KONTAKT — dane po lewej, duża mapa z wizytówką Google po prawej */}
        <section className="wrap grid gap-5 py-20 lg:grid-cols-[1fr_1.7fr] lg:py-24">
          <div className="flex flex-col rounded-[2rem] bg-peach p-8 sm:p-10">
            <h2 className="font-display text-4xl">Kontakt.</h2>
            <dl className="mt-6 space-y-4 text-lg">
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
            <div className="mt-auto pt-8">
              <Socials />
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] bg-paper ring-1 ring-line">
            <iframe title="The Bania na mapie Google" className="h-[360px] w-full border-0 lg:h-[460px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={CONFIG.mapEmbed} />
            <a href={CONFIG.googleMaps} target="_blank" rel="noreferrer" className="flex items-center justify-between px-6 py-4 font-bold transition hover:bg-peach">
              Opinie i dojazd w Google Maps <span aria-hidden>→</span>
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
