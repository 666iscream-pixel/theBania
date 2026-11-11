"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ADDONS, CONFIG, type Promo } from "@/lib/config";
import { activePromo, isBlacklisted, normalizePhone } from "@/lib/admin";
import { DAYS_SHORT, fmtDate, fmtDateShort, fmtHour, isHoliday, isWeekendRate, monthName, pad, todayKey, toKey } from "@/lib/dates";
import { calcPrice, zl } from "@/lib/pricing";
import { dayOpen, daySlots, findAlternatives, highSeasonFor, REASON_LABEL } from "@/lib/slots";
import { useDemo } from "@/lib/store";
import { DayTimeline } from "@/components/DayTimeline";
import { asset } from "@/lib/asset";

// 3 kroki: wybór godziny od razu przenosi dalej, dane i zadatek na jednym ekranie (TZ: 3–4 kliknięcia).
const STEPS = ["Termin", "Goście i dodatki", "Dane i zadatek"];
const DURATIONS = [2, 3, 4, 5, 6, 8];

export function BookingFlow() {
  const { ready } = useDemo();
  return ready ? <Flow /> : <Loading />;
}

export function Loading() {
  return <div className="py-32 text-center text-muted">Ładowanie kalendarza…</div>;
}

function Flow() {
  const { settings, now, bookingsFor, addBooking, admin, setAdmin } = useDemo();
  const [step, setStep] = useState(0);
  // Flow renderuje się tylko po hydratacji, więc można bezpiecznie czytać adres (link „najbliższy wolny termin”).
  const [initial] = useState(() => {
    const q = new URLSearchParams(window.location.search);
    const d = q.get("d");
    const h = Number(q.get("h"));
    return { date: d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null, hours: DURATIONS.includes(h) ? h : 3 };
  });
  const [duration, setDuration] = useState(initial.hours);
  const [date, setDate] = useState<string | null>(initial.date);
  const [start, setStart] = useState<number | null>(null);
  const [guests, setGuests] = useState(4);
  const [tubHours, setTubHours] = useState(0);
  const [tubStart, setTubStart] = useState<number | null>(null);
  const [addons, setAddons] = useState<Record<string, number>>({});
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [phoneError, setPhoneError] = useState(false);
  const [consents, setConsents] = useState({ terms: false, marketing: false });
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<Promo | null>(null);
  const [promoPopup, setPromoPopup] = useState(false);
  const [holdUntil, setHoldUntil] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [expired, setExpired] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [pay, setPay] = useState<"blik" | "p24" | "card">("blik");
  const [done, setDone] = useState(false);

  const today = todayKey(now);
  const slotOpts = { duration, now, season: settings.season, keepEvening: settings.keepEvening };
  const slots = useMemo(
    () => (date ? daySlots({ ...slotOpts, date, bookings: bookingsFor(date) }) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [date, duration, now, settings.season, settings.keepEvening, bookingsFor],
  );
  const okSlots = slots.filter((s) => s.ok);
  const alternatives = useMemo(
    () => (date && okSlots.length === 0 ? findAlternatives({ ...slotOpts, date, bookings: bookingsFor(date) }, bookingsFor) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [date, okSlots.length, duration, now, settings.season, settings.keepEvening, bookingsFor],
  );

  const price = date ? calcPrice({ date, hours: duration, tubHours, guests, addons, promo }, admin) : null;
  const addonPrice = (id: string, fallback: number | null) => (id in admin.addonPrices ? admin.addonPrices[id] : fallback);
  const masterLocked = (addons["witki-dab"] || 0) < 2; // TZ: parmistrz tylko przy min. 2 witkach dębowych
  const tubLabel = tubHours > 0 && tubStart !== null ? `${fmtHour(tubStart)}–${fmtHour(tubStart + tubHours)}` : "";

  // Blokada terminu na 5 minut po przejściu do danych.
  useEffect(() => {
    if (!holdUntil || done) return;
    const t = setInterval(() => {
      const left = Math.max(0, holdUntil - Date.now());
      setRemaining(left);
      if (left === 0) {
        setExpired(true);
        setHoldUntil(null);
        setStep(0);
        setStart(null);
      }
    }, 250);
    return () => clearInterval(t);
  }, [holdUntil, done]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, done]);

  function chooseDuration(d: number) {
    setDuration(d);
    setStart(null);
    setTubHours(0);
    setTubStart(null);
  }

  function pickDate(d: string) {
    setDate(d);
    setStart(null);
    setExpired(false);
    // Długość i godziny są pod kalendarzem — przewijamy do nich, szczególnie ważne na telefonie.
    setTimeout(() => document.getElementById("day-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  // Wybór godziny od razu prowadzi dalej — mniej kliknięć na telefonie.
  function pickStart(h: number) {
    setStart(h);
    setTubHours(0);
    setTubStart(null);
    setStep(1);
  }

  function chooseTub(h: number) {
    setTubHours(h);
    setTubStart(h === 0 || start === null ? null : start);
  }

  function changeAddon(id: string, v: number) {
    const next = { ...addons, [id]: v };
    if (id === "witki-dab" && v < 2) next.parmistrz = 0;
    setAddons(next);
  }

  function goDetails() {
    setHoldUntil(Date.now() + CONFIG.holdMinutes * 60000);
    setRemaining(CONFIG.holdMinutes * 60000);
    setExpired(false);
    setStep(2);
  }

  function applyPromo() {
    const p = activePromo(admin, promoInput);
    setPromo(p);
    if (!p && promoInput.trim() !== "") setPromoPopup(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const digits = normalizePhone(form.phone);
    if (digits.length < 9 || digits.length > 12) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);
    if (isBlacklisted(admin, form.phone, form.email)) {
      setBlocked(true);
      return;
    }
    setBlocked(false);
    confirm();
  }

  function confirm() {
    if (!date || start === null || !price) return;
    const extras = ADDONS.filter((a) => addons[a.id]).map((a) => `${a.name} × ${addons[a.id]}`);
    if (tubLabel) extras.unshift(`Gorąca beczka ${tubLabel}`);
    addBooking({
      id: `www-${date}-${start}`,
      date,
      start,
      end: start + duration,
      status: "paid",
      source: "www",
      name: form.name || "Gość",
      phone: form.phone,
      guests,
      tubHours,
      extras,
      total: price.total,
    });
    if (promo) setAdmin({ usedPromos: [...admin.usedPromos, { code: promo.code, date: todayKey(now) }] });
    setDone(true);
    setHoldUntil(null);
  }

  if (done && date && start !== null && price) {
    const sms = admin.templates.confirm
      .replace("{data}", fmtDateShort(date))
      .replace("{godziny}", `${fmtHour(start)}–${fmtHour(start + duration)}`)
      .replace("{mapa}", CONFIG.googleMaps)
      .replace("{zadatek}", String(price.deposit));
    return (
      <div className="mx-auto max-w-2xl py-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-moss text-3xl text-cream">✓</div>
        <h1 className="mt-6 font-display text-5xl">Dziękujemy za rezerwację!</h1>
        <p className="mt-4 text-lg text-muted first-letter:uppercase">
          {fmtDate(date)}, {fmtHour(start)}–{fmtHour(start + duration)} · {guests} {guests === 1 ? "osoba" : guests < 5 ? "osoby" : "osób"}
        </p>
        <div className="mx-auto mt-8 max-w-md space-y-2 rounded-3xl bg-paper p-6 text-left text-sm ring-1 ring-line">
          <Row l="Zapłacono (zadatek)" r={zl(price.deposit)} />
          <Row l="Do zapłaty na miejscu" r={zl(price.rest + price.onSite)} />
          {tubLabel && <Row l="Gorąca beczka" r={tubLabel} />}
          <div className="border-t border-line pt-3">
            <div className="font-semibold">{CONFIG.address}</div>
            <a href={CONFIG.googleMaps} target="_blank" rel="noreferrer" className="font-semibold text-wood underline underline-offset-2">
              Jak dojechać — Google Maps →
            </a>
          </div>
          <div className="border-t border-line pt-3 text-muted">
            <p className="mb-1 font-semibold text-ink">Wysłaliśmy SMS{form.email ? " i e-mail" : ""}:</p>
            <p className="rounded-xl bg-cream p-3 text-xs">{sms}</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-muted">
          Rezerwacja pojawiła się już w <Link href="/admin" className="font-semibold text-wood underline">panelu administratora</Link> (demo).
        </p>
        <button onClick={() => location.reload()} className="mt-8 rounded-full bg-ink px-6 py-3 font-semibold text-cream">
          Nowa rezerwacja
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-5xl">Rezerwacja.</h1>
      <ol className="mt-6 flex flex-wrap gap-2 text-sm">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 ${i === step ? "bg-ink text-cream" : i < step ? "bg-peach text-ink" : "bg-paper text-muted ring-1 ring-line"}`}
          >
            <span className="font-semibold">{i + 1}</span> {s}
          </li>
        ))}
      </ol>

      {holdUntil && step >= 2 && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-peach px-4 py-3 text-sm">
          <span className="font-mono text-lg font-semibold tabular-nums">
            {pad(Math.floor(remaining / 60000))}:{pad(Math.floor((remaining % 60000) / 1000))}
          </span>
          Termin jest dla Ciebie zablokowany. Dokończ rezerwację, zanim czas minie.
        </div>
      )}
      {expired && (
        <div className="mt-4 rounded-2xl bg-ember/10 px-4 py-3 text-sm text-ember ring-1 ring-ember/30">
          Czas na dokończenie rezerwacji minął — termin został zwolniony. Wybierz go ponownie.
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          {step === 0 && (
            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-semibold">Wybierz dzień</h2>
                <Calendar
                  today={today}
                  selected={date}
                  onPick={pickDate}
                  availability={(d) => {
                    if (!dayOpen(d, now)) return -1;
                    // Czy w ogóle jest coś wolnego (od min. 2 h) — długość gość wybiera po kliknięciu w dzień
                    return daySlots({ ...slotOpts, duration: CONFIG.minHours, date: d, bookings: bookingsFor(d) }).filter((s) => s.ok).length;
                  }}
                />
              </section>

              {date && (
                <section id="day-panel" className="scroll-mt-28 rounded-3xl bg-paper p-5 ring-1 ring-line sm:p-6">
                  <h2 className="text-lg font-semibold first-letter:uppercase">{fmtDate(date)}</h2>
                  {/* Logika (sezon, oś dnia ze sprzątaniem) — tylko w trybie prezentacji, gościa by myliła */}
                  {settings.showHidden && (
                    <div className="mt-4 rounded-2xl border border-dashed border-line p-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${highSeasonFor(date, settings.season) ? "bg-ink text-cream" : "bg-peach"}`}>
                        {highSeasonFor(date, settings.season) ? "Sezon wysoki — godziny bez martwych okien" : "Sezon niski — każda wolna godzina"}
                      </span>
                      <div className="mt-4">
                        <DayTimeline bookings={bookingsFor(date)} selected={start !== null ? { start, end: start + duration } : null} />
                      </div>
                    </div>
                  )}

                  <h3 className="mt-4 text-sm font-semibold">Na ile godzin?</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {DURATIONS.map((d) => (
                      <button
                        key={d}
                        onClick={() => chooseDuration(d)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${duration === d ? "bg-ink text-cream" : "bg-cream ring-1 ring-line hover:ring-ink"}`}
                      >
                        {d} h
                      </button>
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs text-muted">Minimum 2 godziny. Od 3. godziny −50%.</p>

                  {okSlots.length > 0 ? (
                    <>
                      <h3 className="mt-5 text-sm font-semibold">Wybierz godzinę</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(settings.showHidden ? slots : okSlots).map((s) =>
                          s.ok ? (
                            <button
                              key={s.start}
                              onClick={() => pickStart(s.start)}
                              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${start === s.start ? "bg-ember text-cream" : "bg-cream ring-1 ring-line hover:ring-ember"}`}
                            >
                              {fmtHour(s.start)}–{fmtHour(s.end)}
                            </button>
                          ) : (
                            <div key={s.start} title={s.detail} className="rounded-xl border border-dashed border-line px-3 py-1.5 text-xs text-muted">
                              <div className="font-semibold line-through">{fmtHour(s.start)}–{fmtHour(s.end)}</div>
                              <div>{REASON_LABEL[s.reason!]}</div>
                            </div>
                          ),
                        )}
                      </div>
                      {settings.showHidden && (
                        <p className="mt-3 text-xs text-muted">Przekreślone godziny są ukryte dla gościa. Najedź na nie, aby zobaczyć wyjaśnienie.</p>
                      )}
                    </>
                  ) : (
                    alternatives && (
                      <div className="mt-6 rounded-2xl bg-peach/60 p-5">
                        <div className="font-semibold">W tym dniu nie ma wolnego terminu na {duration} h</div>
                        {alternatives.shorter.length > 0 && (
                          <div className="mt-3">
                            <div className="text-sm text-muted">Ten sam dzień, krócej:</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {alternatives.shorter.map((a) => (
                                <button key={a.duration} onClick={() => chooseDuration(a.duration)} className="rounded-xl bg-paper px-3 py-2 text-sm font-semibold ring-1 ring-line hover:ring-ember">
                                  {a.duration} h — od {a.starts.slice(0, 3).map(fmtHour).join(", ")}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        {alternatives.otherDays.length > 0 && (
                          <div className="mt-4">
                            <div className="text-sm text-muted">{duration} h w najbliższe dni:</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {alternatives.otherDays.map((a) => (
                                <button key={a.date} onClick={() => pickDate(a.date)} className="rounded-xl bg-paper px-3 py-2 text-sm font-semibold ring-1 ring-line hover:ring-ember">
                                  {fmtDateShort(a.date)} — od {a.starts.slice(0, 2).map(fmtHour).join(", ")}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </section>
              )}

              {start !== null && <NavButtons onNext={() => setStep(1)} />}
            </div>
          )}

          {step === 1 && start !== null && (
            <div className="space-y-6">
              <section className="rounded-3xl bg-paper p-6 ring-1 ring-line">
                <h2 className="text-lg font-semibold">Liczba gości</h2>
                <p className="mt-1 text-sm text-muted">Bazowa cena wynajmu obejmuje grupę do 6 osób włącznie.</p>
                <div className="mt-4 rounded-2xl bg-peach/50 p-4 text-sm">
                  <b>Planujecie wizytę w większym gronie? (do 12 gości)</b> — dopłata za każdego dodatkowego gościa wynosi {CONFIG.extraGuestPerHour} PLN / godz.
                </div>
                <label className="mt-4 block text-sm font-medium">
                  Podaj planowaną liczbę gości
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="mt-1 block w-48 rounded-xl border border-line bg-cream px-3 py-2.5">
                    {Array.from({ length: CONFIG.maxGuests }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>
                <p className="mt-3 text-xs text-muted">
                  Opłata za dodatkowych gości (powyżej 6 osób) naliczana jest na podstawie faktycznej liczby osób w dniu wizyty. Kwota końcowa podlega przeliczeniu na miejscu: jeśli przyjdzie mniej osób niż zadeklarowano, dopłata za nie nie jest pobierana.
                </p>
              </section>

              <section className="rounded-3xl bg-paper p-6 ring-1 ring-line">
                <div className="flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset("/img/tub-day.jpg")} alt="" className="hidden h-24 w-24 rounded-2xl object-cover sm:block" />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">Gorąca beczka</h2>
                    <p className="text-sm text-muted">40°C, 20 dysz do hydromasażu. {admin.tubPerHour} zł/h, minimum 2 h, od 3. godziny −50%.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[0, ...Array.from({ length: Math.max(0, duration - 1) }, (_, i) => i + 2)].map((h) => (
                        <button
                          key={h}
                          onClick={() => chooseTub(h)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${tubHours === h ? "bg-ink text-cream" : "bg-cream ring-1 ring-line"}`}
                        >
                          {h === 0 ? "Bez beczki" : `${h} h`}
                        </button>
                      ))}
                    </div>
                    {tubHours > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold">
                          W których godzinach? <span className="font-normal text-muted">(w ramach rezerwacji {fmtHour(start)}–{fmtHour(start + duration)})</span>
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {Array.from({ length: duration - tubHours + 1 }, (_, i) => start + i).map((t) => (
                            <button
                              key={t}
                              onClick={() => setTubStart(t)}
                              className={`rounded-xl px-3 py-2 text-sm font-semibold ${tubStart === t ? "bg-ember text-cream" : "bg-cream ring-1 ring-line hover:ring-ember"}`}
                            >
                              {fmtHour(t)}–{fmtHour(t + tubHours)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-3xl bg-paper p-6 ring-1 ring-line">
                <h2 className="text-lg font-semibold">Dodatki</h2>
                <div className="mt-4 divide-y divide-line">
                  {ADDONS.map((a) => {
                    const p = addonPrice(a.id, a.price);
                    const locked = a.id === "parmistrz" && masterLocked;
                    return (
                      <div key={a.id} className={`flex items-center justify-between gap-4 py-3 ${locked ? "opacity-60" : ""}`}>
                        <div>
                          <div className="font-medium">{a.name}</div>
                          <div className="text-sm text-muted">
                            {p === null ? "cena do ustalenia" : `${p} zł / ${a.unit}`}
                            {a.hint ? ` · ${a.hint.replace(" · cena do ustalenia", "")}` : ""}
                          </div>
                          {locked && <div className="mt-1 text-xs font-semibold text-ember">Dostępne po dodaniu min. 2 witek dębowych</div>}
                        </div>
                        <Stepper
                          value={addons[a.id] || 0}
                          max={locked ? 0 : (a.max ?? (a.id === "parmistrz" ? guests : 10))}
                          disabled={locked}
                          onChange={(v) => changeAddon(a.id, v)}
                        />
                      </div>
                    );
                  })}
                </div>
              </section>

              <NavButtons onBack={() => setStep(0)} onNext={goDetails} nextLabel="Dalej" nextDisabled={tubHours > 0 && tubStart === null} />
            </div>
          )}

          {step === 2 && price && (
            <form onSubmit={submit} className="space-y-6">
              <section className="grid gap-4 rounded-3xl bg-paper p-6 ring-1 ring-line sm:grid-cols-2">
                <Input label="Imię *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required autoComplete="name" />
                <div>
                  <Input
                    label="Telefon *"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(v) => {
                      setForm({ ...form, phone: v });
                      setPhoneError(false);
                    }}
                    required
                    placeholder="+48 600 000 000"
                  />
                  {phoneError && <p className="mt-1 text-xs font-semibold text-ember">Podaj poprawny numer telefonu (9 cyfr, opcjonalnie z +48).</p>}
                </div>
                <Input label="E-mail (opcjonalnie)" type="email" autoComplete="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                <Input label="Uwagi (opcjonalnie)" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} />
              </section>

              <section className="rounded-3xl bg-paper p-6 ring-1 ring-line">
                <h2 className="font-semibold">Kod promocyjny lub bon podarunkowy</h2>
                <div className="mt-3 flex gap-2">
                  <input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="np. BANIA10"
                    className="w-full max-w-xs rounded-xl border border-line bg-cream px-3 py-2.5 uppercase"
                  />
                  <button type="button" onClick={applyPromo} className="rounded-xl bg-ink px-4 font-semibold text-cream">
                    Zastosuj
                  </button>
                </div>
                {promo && <p className="mt-2 text-sm font-semibold text-moss">✓ {promo.label} — suma przeliczona</p>}
              </section>

              {price.deposit > 0 && (
                <section className="rounded-3xl bg-paper p-6 ring-1 ring-line">
                  <h2 className="font-semibold">Zadatek {zl(price.deposit)} — metoda płatności</h2>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {([
                      ["blik", "BLIK"],
                      ["p24", "Przelewy24"],
                      ["card", "Karta"],
                    ] as const).map(([v, l]) => (
                      <button
                        type="button"
                        key={v}
                        onClick={() => setPay(v)}
                        className={`rounded-2xl py-4 font-semibold ${pay === v ? "bg-ink text-cream" : "bg-cream ring-1 ring-line"}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  {pay === "blik" && (
                    <input inputMode="numeric" maxLength={6} placeholder="Kod BLIK — 6 cyfr" className="mt-3 w-full rounded-xl border border-line bg-cream px-3 py-3 text-center font-mono text-xl tracking-[0.4em]" />
                  )}
                </section>
              )}

              <section className="space-y-3 text-sm">
                <label className="flex gap-3">
                  <input type="checkbox" required checked={consents.terms} onChange={(e) => setConsents({ ...consents, terms: e.target.checked })} className="mt-0.5 h-4 w-4" />
                  <span>
                    Akceptuję <Link href="/regulamin" className="underline" target="_blank">regulamin</Link> i politykę prywatności. Rozumiem, że <b>zadatek jest bezzwrotny</b>. *
                  </span>
                </label>
                <label className="flex gap-3 text-muted">
                  <input type="checkbox" checked={consents.marketing} onChange={(e) => setConsents({ ...consents, marketing: e.target.checked })} className="mt-0.5 h-4 w-4" />
                  <span>Chcę otrzymywać informacje o promocjach SMS-em i e-mailem (opcjonalnie).</span>
                </label>
              </section>

              {blocked && (
                <div className="rounded-2xl bg-peach p-4 text-sm">
                  Nie możemy dokończyć tej rezerwacji online. Prosimy o kontakt telefoniczny: <a href={CONFIG.phoneHref} className="font-semibold underline">{CONFIG.phone}</a>.
                </div>
              )}

              <div className="flex items-center justify-between gap-4 pt-2">
                <button type="button" onClick={() => setStep(1)} className="font-semibold text-muted hover:text-ink">
                  ← Wstecz
                </button>
                <button className="rounded-full bg-ember px-8 py-3.5 font-bold text-white shadow-lg shadow-ember/25 transition hover:bg-[#c71f1a]">
                  {price.deposit === 0 ? "Potwierdź rezerwację" : `Zapłać ${zl(price.deposit)}`}
                </button>
              </div>
              <p className="text-right text-xs text-muted">Demo — płatność nie zostanie pobrana. W pełnej wersji: Stripe / Przelewy24.</p>
            </form>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl bg-ink p-6 text-cream">
            <div className="font-display text-2xl">Podsumowanie</div>
            {!date ? (
              <p className="mt-3 text-sm text-cream/65">Wybierz dzień i godzinę — cena policzy się automatycznie.</p>
            ) : (
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <div className="first-letter:uppercase">{fmtDate(date)}</div>
                  <div className="text-cream/65">
                    {start !== null ? `${fmtHour(start)}–${fmtHour(start + duration)}` : "godzina —"} · {duration} h · {guests} os.
                  </div>
                  <div className="mt-1 text-xs text-peach">
                    {isHoliday(date, admin.holidays) ? "Święto — taryfa weekendowa" : isWeekendRate(date, admin.holidays) ? "Taryfa weekendowa" : "Taryfa Pn–Czw"} · {price?.rate} zł/h
                  </div>
                </div>
                <div className="space-y-2 border-t border-cream/15 pt-3">
                  {price?.lines.map((l) => (
                    <div key={l.label}>
                      <Row l={l.label} r={zl(l.amount)} />
                      {l.label.startsWith("Gorąca beczka") && tubLabel && <div className="text-xs text-cream/50">{tubLabel}</div>}
                      {l.detail && <div className="text-xs text-cream/50">{l.detail}</div>}
                    </div>
                  ))}
                  {price && price.discount > 0 && <Row l={`Kod ${promo?.code}`} r={`−${zl(price.discount)}`} />}
                </div>
                {price && (
                  <div className="space-y-1.5 border-t border-cream/15 pt-3">
                    <Row l="Razem" r={zl(price.total)} bold />
                    <Row l="Zadatek teraz" r={zl(price.deposit)} />
                    <Row l="Na miejscu" r={zl(price.rest)} />
                    {price.onSite > 0 && (
                      <div className="rounded-xl bg-cream/10 p-3 text-xs">
                        + dopłata za {guests - CONFIG.baseGuests} {guests - CONFIG.baseGuests === 1 ? "dodatkowego gościa" : "dodatkowych gości"}: {zl(price.onSite)} — rozliczana na miejscu wg faktycznej liczby osób
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-4 rounded-[1.5rem] bg-paper p-5 ring-1 ring-line">
            <p className="font-display text-lg">Dobrze wiedzieć.</p>
            <ul className="mt-3 space-y-3 text-sm">
              <Info icon="card" title={`Zadatek ${admin.deposit} zł`} text="Płatny online przy rezerwacji, bezzwrotny." />
              <Info icon="home" title="Reszta na miejscu" text="Płacisz w dniu wizyty." />
              <Info
                icon="help"
                title="Masz pytanie?"
                text={
                  <Link href="/regulamin#faq" target="_blank" className="font-semibold text-ink underline underline-offset-2">
                    Odpowiedzi w FAQ
                  </Link>
                }
              />
            </ul>
            <Link href="/regulamin#rezerwacja" target="_blank" className="mt-4 flex items-center justify-between rounded-xl bg-peach px-4 py-2.5 text-sm font-bold transition hover:bg-sand hover:text-paper">
              Zasady rezerwacji <span aria-hidden>→</span>
            </Link>
          </div>
        </aside>
      </div>

      {promoPopup && (
        <div role="alertdialog" aria-modal="true" aria-labelledby="promo-title" className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" onClick={() => setPromoPopup(false)}>
          <div className="w-full max-w-sm rounded-[1.75rem] bg-paper p-7 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ember/10 text-2xl font-bold text-ember">!</div>
            <h2 id="promo-title" className="mt-4 font-display text-2xl">Promokod nie jest aktywny</h2>
            <p className="mt-2 text-sm text-muted">Sprawdź, czy kod jest wpisany poprawnie. Każdy kod działa tylko raz.</p>
            <button autoFocus onClick={() => setPromoPopup(false)} className="mt-6 w-full rounded-full bg-ink py-3 font-bold text-peach">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Calendar({ today, selected, onPick, availability }: { today: string; selected: string | null; onPick: (d: string) => void; availability: (d: string) => number }) {
  const t = new Date(`${today}T12:00:00`);
  const [offset, setOffset] = useState(0);
  const first = new Date(t.getFullYear(), t.getMonth() + offset, 1);
  const lead = (first.getDay() + 6) % 7;
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => toKey(new Date(first.getFullYear(), first.getMonth(), i + 1)))];

  return (
    <div className="mt-3 rounded-3xl bg-paper p-4 ring-1 ring-line sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <button disabled={offset === 0} onClick={() => setOffset(offset - 1)} className="rounded-full px-3 py-1 text-lg disabled:opacity-25" aria-label="Poprzedni miesiąc">←</button>
        <div className="font-semibold">{monthName(first.getFullYear(), first.getMonth())}</div>
        <button disabled={offset >= 6} onClick={() => setOffset(offset + 1)} className="rounded-full px-3 py-1 text-lg disabled:opacity-25" aria-label="Następny miesiąc">→</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
        {DAYS_SHORT.map((d) => <div key={d} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const n = availability(d);
          const sel = d === selected;
          const closed = n < 0;
          return (
            <button
              key={d}
              disabled={closed}
              onClick={() => onPick(d)}
              className={`flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition sm:aspect-[1.2] ${
                sel ? "bg-ember text-cream" : closed ? "text-muted/40" : n === 0 ? "bg-cream text-muted" : "bg-cream ring-1 ring-line hover:ring-ember"
              }`}
            >
              <span className="font-semibold">{Number(d.slice(8))}</span>
              {!closed && (
                <span className={`text-[10px] ${sel ? "text-cream/80" : n === 0 ? "text-muted" : n <= 2 ? "text-wood" : "text-moss"}`}>{n === 0 ? "brak" : n <= 2 ? "mało" : "wolne"}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const ICONS = {
  card: "M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11ZM3 9h18v2H3V9Zm3 6h4v1.5H6V15Z",
  home: "M12 3 2.5 11h2.5v9h5.5v-6h3v6H19v-9h2.5L12 3Z",
  help: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm2.1-7.7-.9.9c-.7.7-1.2 1.3-1.2 2.8h-2v-.5c0-1.1.4-2.1 1.2-2.8l1.2-1.3c.4-.4.6-.9.6-1.4a2 2 0 0 0-4 0H8a4 4 0 0 1 8 0c0 .9-.4 1.7-.9 2.3Z",
};

function Info({ icon, title, text }: { icon: keyof typeof ICONS; title: string; text: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-peach">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
          <path d={ICONS[icon]} fillRule="evenodd" />
        </svg>
      </span>
      <div>
        <div className="font-bold">{title}</div>
        <div className="text-muted">{text}</div>
      </div>
    </li>
  );
}

function Stepper({ value, max, onChange, disabled }: { value: number; max: number; onChange: (v: number) => void; disabled?: boolean }) {
  return (
    <div className={`flex items-center gap-1 rounded-full bg-cream ring-1 ring-line ${disabled ? "pointer-events-none" : ""}`} aria-disabled={disabled}>
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} className="h-9 w-9 text-lg" aria-label="Mniej">−</button>
      <span className="w-5 text-center font-semibold tabular-nums">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} className="h-9 w-9 text-lg" aria-label="Więcej">+</button>
    </div>
  );
}

function Input({ label, value, onChange, ...rest }: { label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input {...rest} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2.5" />
    </label>
  );
}

function NavButtons({ onBack, onNext, nextDisabled, nextLabel = "Dalej" }: { onBack?: () => void; onNext?: () => void; nextDisabled?: boolean; nextLabel?: string }) {
  return (
    <div className="flex items-center justify-between pt-2">
      {onBack ? <button type="button" onClick={onBack} className="font-semibold text-muted hover:text-ink">← Wstecz</button> : <span />}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="rounded-full bg-ink px-7 py-3 font-semibold text-cream transition hover:bg-wood-dark disabled:opacity-30"
        >
          {nextLabel} →
        </button>
      )}
    </div>
  );
}

function Row({ l, r, bold }: { l: string; r: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${bold ? "text-base font-semibold" : ""}`}>
      <span>{l}</span>
      <span className="tabular-nums">{r}</span>
    </div>
  );
}
