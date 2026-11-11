import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Art, Dashes, PostTitle, type ArtName } from "@/components/Art";
import { Socials } from "@/components/Socials";
import { NextSlot } from "@/components/NextSlot";
import { CONFIG } from "@/lib/config";

// Kolejność: pierwsze wrażenie → kim jesteśmy → co jest na miejscu → na jaką okazję → rezerwacja → zdjęcia → opinie → kontakt.

const FACTS: { art: ArtName; title: string; text: string }[] = [
  { art: "window", title: "Na wyłączność", text: "Cały obiekt tylko dla Waszej grupy — bez obcych ludzi." },
  { art: "lady", title: "Do 12 osób", text: "Cena obejmuje 6 osób, większa grupa za dopłatą." },
  { art: "hat", title: "Wszystko na miejscu", text: "Czapeczki, rękawiczki, kapcie, herbata, miód i owoce." },
  { art: "hourglass", title: "Codziennie 12–24", text: "Minimum 2 godziny, od trzeciej każda o połowę taniej." },
];

const VISIT: { img: string; art: ArtName; title: string; text: string }[] = [
  { img: "steam-room-2", art: "stove", title: "Łaźnia parowa", text: "Piec opalany drewnem daje miękką, głęboką parę. Wchodzicie, kiedy chcecie i ile chcecie." },
  { img: "witki", art: "venik", title: "Witki i parmistrz", text: "Brzozowe, dębowe lub eukaliptusowe. Doradzimy zestaw, a na życzenie ceremonię poprowadzi parmistrz." },
  { img: "cold-plunge", art: "tub", title: "Gorąca i zimna beczka", text: "Gorąca beczka 40°C z hydromasażem i zimna beczka na zewnątrz — na zmianę, jak lubicie." },
  { img: "tea", art: "teapot", title: "Strefa relaksu", text: "Herbata, miód i owoce przy stole, ogród z hamakiem i grill — bez obcych ludzi obok." },
];

const OCCASIONS: { art: ArtName; title: string; text: string }[] = [
  { art: "teapot", title: "Urodziny i święta", text: "Cały obiekt dla Was, grill w ogrodzie i stół na wspólną kolację." },
  { art: "tub", title: "Wieczór z przyjaciółmi", text: "Para, gorąca beczka pod gołym niebem i nikt obcy obok." },
  { art: "venik", title: "We dwoje", text: "Spokojny wieczór tylko dla Was dwojga — z ceremonią z witkami." },
  { art: "window", title: "Spotkanie firmowe", text: "Integracja dla zespołu do 12 osób. Szczegóły ustalimy indywidualnie." },
];

const STEPS = [
  { t: "Wybierz dzień i godzinę", d: "Kalendarz pokaże tylko naprawdę wolne terminy." },
  { t: "Dodaj beczkę, witki, grill", d: "Cenę ze wszystkimi zniżkami liczymy od razu." },
  { t: "Wpłać zadatek 200 zł", d: "BLIK, Przelewy24 lub karta — termin jest Wasz." },
  { t: "Dostaniesz SMS z potwierdzeniem", d: "Z adresem i mapą, a dzień przed — przypomnienie." },
];

const GALLERY = [
  { src: "exterior", alt: "Budynek bani z ogrodem" },
  { src: "steam-light", alt: "Łaźnia parowa w promieniach światła" },
  { src: "tub-day", alt: "Gorąca beczka" },
  { src: "witki-back", alt: "Ceremonia z witkami" },
  { src: "garden-hammock", alt: "Ogród z hamakiem" },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-x-clip">
        {/* HERO — tekst i zdjęcie w jednym kontenerze, z oddechem; całość mieści się w pierwszym ekranie */}
        <section className="bg-peach pb-10 lg:pb-12">
          <div className="wrap grid gap-8 pt-6 lg:h-[calc(100svh-97px-3rem)] lg:max-h-[660px] lg:min-h-[440px] lg:grid-cols-[1.05fr_1fr] lg:grid-rows-1 lg:gap-12 lg:pt-8">
            <div className="order-2 self-center lg:order-1">
              <p className="font-hand text-2xl text-moss">Wrocław · wynajem na wyłączność</p>
              <h1 className="mt-1 font-display text-[2.6rem] leading-[1.03] sm:text-6xl xl:text-[4rem] lg:[@media(max-height:720px)]:text-5xl">Bania opalana drewnem.</h1>
              <p className="mt-4 max-w-md text-lg text-muted">Łaźnia parowa, gorąca beczka i ogród — cały obiekt tylko dla Was. Do 12 osób, codziennie 12:00–00:00.</p>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 lg:[@media(max-height:720px)]:mt-5">
                <Link href="/rezerwacja" className="rounded-full bg-ember px-8 py-4 text-lg font-bold text-white shadow-lg shadow-ember/30 transition hover:-translate-y-0.5 hover:bg-[#c71f1a]">
                  Zarezerwuj termin →
                </Link>
                <Link href="/cennik" className="font-bold underline underline-offset-4 hover:no-underline">
                  od {CONFIG.prices.weekday} zł/h — cennik
                </Link>
              </div>
              <div className="mt-3">
                <NextSlot />
              </div>

              <a href={CONFIG.googleMaps} target="_blank" rel="noreferrer" className="group mt-7 flex items-center gap-4 border-t-2 border-ink/10 pt-5 text-sm lg:[@media(max-height:720px)]:mt-5 lg:[@media(max-height:720px)]:pt-4">
                <span className="whitespace-nowrap font-display text-3xl">
                  {CONFIG.googleRating} <span className="text-2xl text-[#f2a33a]" aria-hidden>★</span>
                </span>
                <span className="text-muted group-hover:underline">
                  <b className="block text-ink">{CONFIG.googleReviews} opinii w Google</b>
                  {CONFIG.instagramFollowers} obserwujących na Instagramie
                </span>
              </a>
            </div>
            <div className="relative order-1 lg:order-2 lg:min-h-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/hero-steam.jpg"
                alt="Łaźnia parowa z piecem opalanym drewnem"
                fetchPriority="high"
                className="aspect-[16/10] w-full rounded-[2rem] object-cover shadow-xl sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full lg:rounded-[2.5rem]"
              />
            </div>
          </div>
        </section>

        {/* WSTĘP — kim jesteśmy */}
        <section id="o-nas" className="wrap grid scroll-mt-24 gap-12 py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-28">
          <div>
            <p className="font-hand text-3xl text-moss">O nas</p>
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">Witamy w The Bania.</h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
              <p>
                To miejsce, w którym naprawdę zwalniasz. Piec opalany drewnem, miękka para i zapach witek — a obok tylko ludzie, z którymi chcesz spędzić ten czas.
              </p>
              <p>
                Wynajmujecie cały obiekt: łaźnię parową, gorącą beczkę z hydromasażem, strefę relaksu i ogród z hamakiem. Nikt obcy nie wejdzie i nikt nie będzie Was poganiał.
              </p>
              <p>
                Herbata, kawa, miód i owoce czekają na stole, czapeczki, rękawiczki i kapcie też. Wystarczy, że przyjdziecie z ręcznikiem — resztą zajmiemy się my.
              </p>
            </div>
            <Link href="/cennik" className="mt-7 inline-block font-bold underline underline-offset-4 hover:no-underline">Co dokładnie jest w cenie →</Link>
          </div>
          <div className="grid content-start gap-4 sm:grid-cols-2">
            {FACTS.map((f) => (
              <div key={f.title} className="rounded-[1.75rem] bg-peach p-6">
                <Art name={f.art} className="h-20 w-auto" />
                <h3 className="mt-3 font-display text-xl">{f.title}</h3>
                <p className="mt-1 text-sm leading-snug text-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* JAK WYGLĄDA WIZYTA */}
        <section className="bg-peach py-20 lg:py-24">
          <div className="wrap">
            <p className="font-hand text-3xl text-moss">Na miejscu</p>
            <h2 className="max-w-2xl font-display text-4xl leading-tight sm:text-5xl">Wszystko, czego potrzeba do pełnego relaksu.</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {VISIT.map((v) => (
                <article key={v.title} className="flex flex-col overflow-hidden rounded-[2rem] bg-paper">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/img/${v.img}.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-2xl">{v.title}</h3>
                      <Art name={v.art} className="h-12 w-12 shrink-0 object-contain" />
                    </div>
                    <p className="mt-2 leading-snug text-muted">{v.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* NA JAKĄ OKAZJĘ — rozkładówka: duże zdjęcie + lista (inna forma niż karty powyżej) */}
        <section className="wrap grid items-center gap-10 py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] sm:aspect-[4/3] lg:aspect-[4/5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/tub-evening.jpg" alt="Gorąca beczka wieczorem w ogrodzie" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div>
            <p className="font-hand text-3xl text-moss">Dla kogo</p>
            <h2 className="font-display text-4xl sm:text-5xl">Na każdą okazję.</h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {OCCASIONS.map((o) => (
                <li key={o.title} className="flex items-center gap-5 py-5">
                  <Art name={o.art} className="h-14 w-14 shrink-0 object-contain" />
                  <div>
                    <h3 className="font-display text-xl">{o.title}</h3>
                    <p className="mt-0.5 text-muted">{o.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/kontakt" className="mt-7 inline-block font-bold underline underline-offset-4 hover:no-underline">
              Większa grupa lub wydarzenie? Napisz do nas →
            </Link>
          </div>
        </section>

        {/* REZERWACJA */}
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
              <div className="mt-9">
                <Link href="/rezerwacja" className="inline-block rounded-full bg-ember px-7 py-4 font-bold text-white shadow-lg shadow-ember/25 transition hover:-translate-y-0.5 hover:bg-[#c71f1a]">
                  Zarezerwuj termin →
                </Link>
              </div>
            </div>
            <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] lg:min-h-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/relax.jpg" alt="Odpoczynek w strefie relaksu po bani" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
        </section>

        {/* GALERIA */}
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
          <div className="mt-8 text-center">
            <Link href="/galeria" className="inline-block rounded-full border-2 border-ink px-7 py-3 font-bold transition hover:bg-ink hover:text-peach">
              Cała galeria →
            </Link>
          </div>
        </section>

        {/* ZAUFANIE — opinie i społeczność */}
        <section className="wrap pt-20 lg:pt-24">
          <div className="grid items-center gap-8 rounded-[2rem] bg-ink px-8 py-10 text-cream sm:px-12 md:grid-cols-[auto_1fr_auto]">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-7xl">{CONFIG.googleRating}</span>
              <span className="text-4xl text-[#f2a33a]" aria-hidden>★</span>
            </div>
            <div>
              <p className="font-display text-2xl">Goście wracają i polecają.</p>
              <p className="mt-1 text-cream/75">
                {CONFIG.googleReviews} opinii w Google i {CONFIG.instagramFollowers} osób, które obserwują nas na Instagramie.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={CONFIG.googleMaps} target="_blank" rel="noreferrer" className="rounded-full bg-peach px-6 py-3 font-bold text-ink transition hover:bg-cream">
                Opinie w Google →
              </a>
              <a href={CONFIG.instagram} target="_blank" rel="noreferrer" className="rounded-full border-2 border-cream/40 px-6 py-3 font-bold transition hover:bg-cream/10">
                Instagram
              </a>
            </div>
          </div>
        </section>

        {/* FAQ — pasek */}
        <section className="wrap pt-5">
          <Link href="/regulamin#faq" className="group relative flex flex-col gap-4 overflow-hidden rounded-[2rem] bg-sand px-8 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <Dashes className="absolute right-[38%] top-4 hidden w-16 text-paper/60 sm:block" />
            <p className="font-hand text-4xl leading-tight text-paper sm:text-5xl">Odpowiedzi na często zadawane pytania.</p>
            <span className="relative shrink-0 self-start rounded-full bg-paper px-6 py-3 font-bold text-ink transition group-hover:bg-ink group-hover:text-peach sm:self-auto">
              Regulamin i FAQ →
            </span>
          </Link>
        </section>

        {/* KONTAKT */}
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
