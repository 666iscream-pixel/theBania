"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ADDONS, BLACKLIST, CONFIG, type Promo } from "@/lib/config";
import { DAYS_SHORT, fmtDate, fmtDateShort, fmtHour, isHoliday, isWeekendRate, monthName, pad, todayKey, toKey } from "@/lib/dates";
import { calcPrice, findPromo, zl } from "@/lib/pricing";
import { dayOpen, daySlots, findAlternatives, highSeasonFor, REASON_LABEL } from "@/lib/slots";
import { useDemo } from "@/lib/store";
import { DayTimeline } from "@/components/DayTimeline";

const STEPS = ["Termin", "Goście i dodatki", "Twoje dane", "Zadatek"];
const DURATIONS = [2, 3, 4, 5, 6, 8];

export function BookingFlow() {
  const { ready } = useDemo();
  return ready ? <Flow /> : <Loading />;
}

export function Loading() {
  return <div className="py-32 text-center text-muted">Ładowanie kalendarza…</div>;
}

function Flow() {
  const { settings, now, bookingsFor, addBooking } = useDemo();
  const [step, setStep] = useState(0);
  const [duration, setDuration] = useState(3);
  const [date, setDate] = useState<string | null>(null);
  const [start, setStart] = useState<number | null>(null);
  const [guests, setGuests] = useState(4);
  const [tubHours, setTubHours] = useState(0);
  const [addons, setAddons] = useState<Record<string, number>>({});
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [consents, setConsents] = useState({ terms: false, marketing: false });
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<Promo | null>(null);
  const [promoError, setPromoError] = useState(false);
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

  const price = date ? calcPrice({ date, hours: duration, tubHours, guests, addons, promo }) : null;

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
    if (tubHours > d) setTubHours(d);
  }

  function pickDate(d: string) {
    setDate(d);
    setStart(null);
    setExpired(false);
  }

  function goDetails() {
    setHoldUntil(Date.now() + CONFIG.holdMinutes * 60000);
    setRemaining(CONFIG.holdMinutes * 60000);
    setExpired(false);
    setStep(2);
  }

  function submitDetails(e: React.FormEvent) {
    e.preventDefault();
    const digits = form.phone.replace(/\D/g, "").replace(/^48(?=\d{9}$)/, "");
    if (BLACKLIST.phones.includes(digits) || BLACKLIST.emails.includes(form.email.trim().toLowerCase())) {
      setBlocked(true);
      return;
    }
    setBlocked(false);
    setStep(3);
  }

  function applyPromo() {
    const p = findPromo(promoInput);
    setPromo(p);
    setPromoError(!p && promoInput.trim() !== "");
  }

  function confirm() {
    if (!date || start === null || !price) return;
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
      extras: ADDONS.filter((a) => addons[a.id]).map((a) => `${a.name} × ${addons[a.id]}`),
      total: price.total,
    });
    setDone(true);
    setHoldUntil(null);
  }

  if (done && date && start !== null && price) {
    return (
      <div className="mx-auto max-w-2xl py-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-moss text-3xl text-cream">✓</div>
        <h1 className="mt-6 font-display text-5xl font-semibold">Rezerwacja potwierdzona</h1>
        <p className="mt-4 text-lg text-muted">
          {fmtDate(date)}, {fmtHour(start)}–{fmtHour(start + duration)} · {guests} {guests === 1 ? "osoba" : guests < 5 ? "osoby" : "osób"}
        </p>
        <div className="mx-auto mt-8 max-w-md space-y-2 rounded-3xl bg-paper p-6 text-left text-sm ring-1 ring-line">
          <Row l="Zapłacono (zadatek)" r={zl(price.deposit)} />
          <Row l="Do zapłaty na miejscu" r={zl(price.rest + price.onSite)} />
          <div className="border-t border-line pt-3 text-muted">
            📱 SMS i ✉️ e-mail z potwierdzeniem zostały wysłane. Przypomnienie przyjdzie 24 h przed wizytą.
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
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <h1 className="font-display text-5xl">Rezerwacja.</h1>
        <p className="text-sm text-muted">
          Zadatek {CONFIG.deposit} zł, reszta na miejscu ·{" "}
          <Link href="/regulamin#rezerwacja" target="_blank" className="font-semibold text-ink underline underline-offset-2">
            Zasady rezerwacji
          </Link>
        </p>
      </div>
      <ol className="mt-6 flex gap-2 overflow-x-auto pb-1 text-sm">
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
                <h2 className="text-lg font-semibold">Na ile godzin?</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => chooseDuration(d)}
                      className={`rounded-full px-5 py-2.5 font-semibold transition ${duration === d ? "bg-ink text-cream" : "bg-paper ring-1 ring-line hover:ring-ink"}`}
                    >
                      {d} h
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm text-muted">Minimum 2 godziny. Od 3. godziny −50%.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold">Wybierz dzień</h2>
                <Calendar
                  today={today}
                  selected={date}
                  onPick={pickDate}
                  availability={(d) => {
                    if (!dayOpen(d, now)) return -1;
                    return daySlots({ ...slotOpts, date: d, bookings: bookingsFor(d) }).filter((s) => s.ok).length;
                  }}
                />
              </section>

              {date && (
                <section className="rounded-3xl bg-paper p-5 ring-1 ring-line sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold first-letter:uppercase">{fmtDate(date)}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${highSeasonFor(date, settings.season) ? "bg-ink text-cream" : "bg-peach"}`}>
                      {highSeasonFor(date, settings.season) ? "Sezon wysoki — godziny bez martwych okien" : "Sezon niski — każda wolna godzina"}
                    </span>
                  </div>
                  <div className="mt-5">
                    <DayTimeline bookings={bookingsFor(date)} selected={start !== null ? { start, end: start + duration } : null} />
                  </div>

                  {okSlots.length > 0 ? (
                    <>
                      <h3 className="mt-6 text-sm font-semibold">Dostępne godziny rozpoczęcia ({duration} h)</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(settings.showHidden ? slots : okSlots).map((s) =>
                          s.ok ? (
                            <button
                              key={s.start}
                              onClick={() => setStart(s.start)}
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

              <NavButtons onNext={() => setStep(1)} nextDisabled={start === null} />
            </div>
          )}

          {step === 1 && (
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
                  <img src="/img/tub-night.jpg" alt="" className="hidden h-24 w-24 rounded-2xl object-cover sm:block" />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">Balia — gorąca beczka</h2>
                    <p className="text-sm text-muted">40°C, 20 dysz do hydromasażu. {CONFIG.prices.tubPerHour} zł/h, minimum 2 h, od 3. godziny −50%.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[0, ...Array.from({ length: Math.max(0, duration - 1) }, (_, i) => i + 2)].map((h) => (
                        <button
                          key={h}
                          onClick={() => setTubHours(h)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${tubHours === h ? "bg-ink text-cream" : "bg-cream ring-1 ring-line"}`}
                        >
                          {h === 0 ? "Bez balii" : `${h} h`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl bg-paper p-6 ring-1 ring-line">
                <h2 className="text-lg font-semibold">Dodatki</h2>
                <div className="mt-4 divide-y divide-line">
                  {ADDONS.map((a) => (
                    <div key={a.id} className="flex items-center justify-between gap-4 py-3">
                      <div>
                        <div className="font-medium">{a.name}</div>
                        <div className="text-sm text-muted">{a.price === null ? "" : `${a.price} zł / ${a.unit}`}{a.hint ? `${a.price === null ? "" : " · "}${a.hint}` : ""}</div>
                      </div>
                      <Stepper
                        value={addons[a.id] || 0}
                        max={a.max ?? (a.id === "parmistrz" ? guests : 10)}
                        onChange={(v) => setAddons({ ...addons, [a.id]: v })}
                      />
                    </div>
                  ))}
                </div>
                
              </section>

              <NavButtons onBack={() => setStep(0)} onNext={goDetails} nextLabel="Przejdź do danych" />
            </div>
          )}

          {step === 2 && (
            <form onSubmit={submitDetails} className="space-y-6">
              <section className="grid gap-4 rounded-3xl bg-paper p-6 ring-1 ring-line sm:grid-cols-2">
                <Input label="Imię i nazwisko" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                <Input label="Telefon" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required pattern="[+0-9 ]{9,}" placeholder="+48 600 000 000" />
                <Input label="E-mail" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
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
                {promo && <p className="mt-2 text-sm font-semibold text-moss">✓ {promo.label}</p>}
                {promoError && <p className="mt-2 text-sm text-ember">Kod jest nieprawidłowy lub został już wykorzystany.</p>}
              </section>

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

              <NavButtons onBack={() => setStep(1)} nextLabel="Przejdź do zadatku" submit />
            </form>
          )}

          {step === 3 && price && (
            <div className="space-y-6">
              {price.deposit === 0 ? (
                <section className="rounded-3xl bg-paper p-6 ring-1 ring-line">
                  <h2 className="text-lg font-semibold">Bon pokrywa całą rezerwację</h2>
                  <p className="mt-1 text-sm text-muted">Zadatek nie jest wymagany. Po potwierdzeniu bon zostanie wykorzystany i przestanie działać.</p>
                  <button onClick={confirm} className="mt-5 w-full rounded-full bg-ember py-3.5 font-semibold text-cream">Potwierdź rezerwację</button>
                </section>
              ) : (
                <section className="rounded-3xl bg-paper p-6 ring-1 ring-line">
                  <h2 className="text-lg font-semibold">Zadatek {zl(price.deposit)}</h2>
                  <p className="mt-1 text-sm text-muted">Bezzwrotny. Pozostałą kwotę zapłacisz na miejscu.</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {([
                      ["blik", "BLIK"],
                      ["p24", "Przelewy24"],
                      ["card", "Karta"],
                    ] as const).map(([v, l]) => (
                      <button
                        key={v}
                        onClick={() => setPay(v)}
                        className={`rounded-2xl py-5 text-lg font-semibold ${pay === v ? "bg-ink text-cream" : "bg-cream ring-1 ring-line"}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  {pay === "blik" && (
                    <input inputMode="numeric" maxLength={6} placeholder="Kod BLIK — 6 cyfr" className="mt-4 w-full rounded-xl border border-line bg-cream px-3 py-3 text-center font-mono text-xl tracking-[0.4em]" />
                  )}
                  <button onClick={confirm} className="mt-5 w-full rounded-full bg-ember py-3.5 font-semibold text-cream">
                    Zapłać {zl(price.deposit)}
                  </button>
                  <p className="mt-3 text-center text-xs text-muted">Demo — płatność nie zostanie pobrana. W pełnej wersji: Stripe / Przelewy24.</p>
                </section>
              )}
              <NavButtons onBack={() => setStep(2)} />
            </div>
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
                    {isHoliday(date) ? "Święto — taryfa weekendowa" : isWeekendRate(date) ? "Taryfa weekendowa" : "Taryfa Pn–Czw"} · {price?.rate} zł/h
                  </div>
                </div>
                <div className="space-y-2 border-t border-cream/15 pt-3">
                  {price?.lines.map((l) => (
                    <div key={l.label}>
                      <Row l={l.label} r={zl(l.amount)} />
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
          <p className="mt-4 px-2 text-xs text-muted">
            Wolisz telefonicznie? <a href={CONFIG.phoneHref} className="underline">{CONFIG.phone}</a>
          </p>
          <p className="mt-1 px-2 text-xs text-muted">
            <Link href="/regulamin#rezerwacja" target="_blank" className="underline">Zasady rezerwacji i zadatku</Link> ·{" "}
            <Link href="/cennik" target="_blank" className="underline">Cennik</Link>
          </p>
        </aside>
      </div>
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
                <span className={`text-[10px] ${sel ? "text-cream/80" : n === 0 ? "text-muted" : "text-moss"}`}>{n === 0 ? "brak" : plTerms(n)}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function plTerms(n: number) {
  if (n === 1) return "1 termin";
  const few = n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14);
  return `${n} ${few ? "terminy" : "terminów"}`;
}

function Stepper({ value, max, onChange }: { value: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-cream ring-1 ring-line">
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

function NavButtons({ onBack, onNext, nextDisabled, nextLabel = "Dalej", submit }: { onBack?: () => void; onNext?: () => void; nextDisabled?: boolean; nextLabel?: string; submit?: boolean }) {
  return (
    <div className="flex items-center justify-between pt-2">
      {onBack ? <button type="button" onClick={onBack} className="font-semibold text-muted hover:text-ink">← Wstecz</button> : <span />}
      {(onNext || submit) && (
        <button
          type={submit ? "submit" : "button"}
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
