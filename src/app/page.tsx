import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Art, Dashes, PostTitle, type ArtName } from "@/components/Art";
import { Socials } from "@/components/Socials";
import { NextSlot } from "@/components/NextSlot";
import { CONFIG } from "@/lib/config";

// Strona prowadzi: wrażenie (hero) → wyobrażenie wizyty → jak zarezerwować → zdjęcia i zaufanie → kontakt.

const VISIT: { img: string; art: ArtName; title: string; text: string }[] = [
  { img: "steam-room-2", art: "stove", title: "Rozgrzewka.", text: "Piec opalany drewnem daje miękką, głęboką parę. Wchodzicie, ile chcecie — bania jest tylko Wasza." },
  { img: "witki", art: "venik", title: "Witki.", text: "Brzozowe, dębowe lub eukaliptusowe. Doradzimy zestaw, a na życzenie ceremonię poprowadzi parmistrz." },
  { img: "cold-plunge", art: "tub", title: "Gorąco i zimno.", text: "Zimna beczka na zewnątrz albo gorąca beczka 40°C z hydromasażem — na zmianę, jak lubicie." },
  { img: "tea", art: "teapot", title: "Relaks.", text: "Herbata, miód i owoce w strefie wypoczynku. Ogród z hamakiem i grill — bez obcych ludzi obok." },
];

const STEPS = [
  { t: "Wybierz dzień i liczbę godzin", d: "Kalendarz pokaże tylko naprawdę wolne terminy." },
  { t: "Dodaj beczkę, witki, grill", d: "Cenę ze wszystkimi zniżkami liczymy od razu." },
  { t: "Wpłać zadatek 200 zł", d: "BLIK, Przelewy24 lub karta — termin jest Wasz." },
  { t: "Dostaniesz SMS i e-mail", d: "Potwierdzenie od razu, przypomnienie dzień przed." },
];

const GALLERY = [
  { src: "exterior", alt: "Budynek bani z ogrodem" },
  { src: "lounge", alt: "Strefa relaksu" },
  { src: "tub-day", alt: "Gorąca beczka" },
  { src: "citrus", alt: "Napar z cytrusów do bani" },
  { src: "garden-hammock", alt: "Ogród z hamakiem" },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-x-clip">
        {/* HERO — tekst po lewej, duże zdjęcie po prawej do krawędzi ekranu */}
        <section className="relative bg-peach">
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-[48%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/steam-light.jpg"
              alt="Łaźnia parowa w promieniach światła"
              fetchPriority="high"
              className="aspect-[16/10] w-full object-cover sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:rounded-bl-[3rem]"
            />
          </div>
          <div className="wrap relative">
            <div className="py-10 lg:flex lg:min-h-[min(calc(100svh-105px),760px)] lg:w-[50%] lg:flex-col lg:justify-center lg:py-16 lg:pr-12">
              <p className="font-hand text-2xl text-moss sm:text-3xl">Wynajem na wyłączność · Wrocław</p>
              <h1 className="mt-2 font-display text-[2.75rem] leading-[1.02] sm:text-6xl xl:text-[4rem]">
                Bania opalana drewnem. Tylko dla Was.
              </h1>
              <p className="mt-5 max-w-md text-lg text-muted">Para, witki i gorąca beczka — cały obiekt dla Ciebie i bliskich, do 12 osób.</p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href="/rezerwacja" className="rounded-full bg-ember px-8 py-4 text-lg font-bold text-white shadow-lg shadow-ember/30 transition hover:-translate-y-0.5 hover:bg-[#c71f1a]">
                  Zarezerwuj termin →
                </Link>
                <Link href="/cennik" className="font-bold underline underline-offset-4 hover:no-underline">
                  od {CONFIG.prices.weekday} zł/h — cennik
                </Link>
              </div>
              <div className="mt-4">
                <NextSlot />
              </div>

              <a href={CONFIG.googleMaps} target="_blank" rel="noreferrer" className="group mt-10 flex items-center gap-4 border-t-2 border-ink/10 pt-6">
                <span className="whitespace-nowrap font-display text-4xl">
                  {CONFIG.googleRating} <span className="text-3xl text-[#f2a33a]" aria-hidden>★</span>
                </span>
                <span className="text-sm text-muted">
                  <b className="block text-lg text-ink">Google</b>
                  <span className="group-hover:underline">{CONFIG.googleReviews} opinii</span>
                </span>
                <span className="mx-2 h-10 w-px bg-ink/15" aria-hidden />
                <span className="text-sm text-muted">
                  <b className="block text-lg text-ink">{CONFIG.instagramFollowers}</b>obserwujących na Instagramie
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* JAK WYGLĄDA WIZYTA — zdjęcie + rycina z Instagrama */}
        <section id="o-nas" className="wrap scroll-mt-24 py-20 lg:py-28">
          <p className="font-hand text-3xl text-moss">Jak wygląda wizyta</p>
          <h2 className="max-w-2xl font-display text-4xl leading-tight sm:text-5xl">Kilka godzin, po których naprawdę odpoczniesz.</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VISIT.map((v, i) => (
              <article key={v.title} className="flex flex-col overflow-hidden rounded-[2rem] bg-peach">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/img/${v.img}.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
                  <span className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-peach font-bold">{i + 1}</span>
                </div>
                <div className="relative flex-1 p-6">
                  <Art name={v.art} className="pointer-events-none absolute -top-10 right-4 h-20 w-16 object-contain" />
                  <h3 className="font-display text-2xl">{v.title}</h3>
                  <p className="mt-2 leading-snug text-muted">{v.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* REZERWACJA — kroki i zdjęcie tej samej wysokości */}
        <section className="bg-peach py-20 lg:py-24">
          <div className="wrap grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            <div>
              <PostTitle art="bell" title="Rezerwacja." sub="Bez dzwonienia — wolne terminy widzisz od razu, o każdej porze." />
              <ol className="relative mt-10">
                <span className="absolute bottom-5 left-[19px] top-5 w-0.5 bg-ink/15" aria-hidden />
                {STEPS.map((s, i) => (
                  <li key={s.t} className="relative flex gap-5 pb-6 last:pb-0">
                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink font-bold text-peach">{i + 1}</span>
                    <div className="pt-1.5">
                      <div className="text-lg font-bold leading-snug">{s.t}</div>
                      <p className="mt-0.5 text-muted">{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="/rezerwacja" className="rounded-full bg-ember px-7 py-4 font-bold text-white shadow-lg shadow-ember/25 transition hover:-translate-y-0.5 hover:bg-[#c71f1a]">Zarezerwuj termin →</Link>
                <a href={CONFIG.phoneHref} className="px-2 font-semibold underline underline-offset-4">lub zadzwoń: {CONFIG.phone}</a>
              </div>
            </div>
            <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] lg:min-h-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/relax.jpg" alt="Odpoczynek w strefie relaksu po bani" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
        </section>

        {/* GALERIA + Instagram */}
        <section className="wrap pt-20 lg:pt-24">
          <h2 className="font-display text-4xl sm:text-5xl">Zajrzyj do środka.</h2>
          <div className="mt-8 grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[220px] md:grid-cols-4 lg:gap-4">
            {GALLERY.map((g, i) => (
              <Link key={g.src} href="/galeria" className={`group overflow-hidden rounded-[1.75rem] ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/img/${g.src}.jpg`} alt={g.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center">
            <Link href="/galeria" className="rounded-full border-2 border-ink px-7 py-3 font-bold transition hover:bg-ink hover:text-peach">
              Cała galeria →
            </Link>
            <a href={CONFIG.instagram} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-4 hover:no-underline">
              {CONFIG.instagramFollowers} osób obserwuje nas na Instagramie
            </a>
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
