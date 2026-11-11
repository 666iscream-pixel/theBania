"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ADDONS, CONFIG, PROMOS } from "@/lib/config";
import { addDays, DAYS_SHORT, fmtDate, fmtDateShort, fmtHour, fromKey, isWeekendRate, todayKey } from "@/lib/dates";
import type { Booking } from "@/lib/bookings";
import { daySlots } from "@/lib/slots";
import { useDemo } from "@/lib/store";
import { Logo } from "@/components/Logo";

type Role = "super" | "manager";
type View = "calendar" | "prices" | "services" | "promos" | "content" | "templates" | "blacklist" | "users" | "export";

const MENU: { id: View; label: string; super?: boolean }[] = [
  { id: "calendar", label: "Kalendarz" },
  { id: "export", label: "Eksport do Excela" },
  { id: "prices", label: "Ceny i święta", super: true },
  { id: "services", label: "Usługi i dodatki", super: true },
  { id: "promos", label: "Kody i bony", super: true },
  { id: "templates", label: "Szablony SMS i e-mail", super: true },
  { id: "content", label: "Treści strony (PL/RU/EN)", super: true },
  { id: "blacklist", label: "Czarna lista", super: true },
  { id: "users", label: "Użytkownicy i role", super: true },
];

const STATUS = {
  paid: { label: "Zadatek opłacony", cls: "bg-moss text-cream" },
  pending: { label: "Czeka na zadatek", cls: "bg-amber-400 text-ink" },
  blocked: { label: "Blokada", cls: "bg-neutral-400 text-ink" },
} as const;

const HOUR_PX = 44;

export function AdminApp() {
  const { ready } = useDemo();
  return ready ? <AdminInner /> : <div className="py-32 text-center text-muted">Ładowanie…</div>;
}

function AdminInner() {
  const { now } = useDemo();
  const [role, setRole] = useState<Role>("super");
  const [view, setView] = useState<View>("calendar");
  const [weekStart, setWeekStart] = useState(() => {
    const t = todayKey(now);
    return addDays(t, -((fromKey(t).getDay() + 6) % 7));
  });
  const [selected, setSelected] = useState<Booking | null>(null);
  const [adding, setAdding] = useState<{ date: string; start: number } | null>(null);

  const menu = MENU.filter((m) => role === "super" || !m.super);
  const current = menu.some((m) => m.id === view) ? view : "calendar";

  return (
    <div className="flex min-h-screen bg-[#f6efe7] text-ink">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-paper p-5 md:flex">
        <div className="flex items-center gap-3">
          <Logo size={44} />
          <div>
            <div className="font-semibold">Panel</div>
            <div className="text-xs text-muted">The Bania</div>
          </div>
        </div>
        <nav className="mt-8 space-y-1 text-sm">
          {menu.map((m) => (
            <button
              key={m.id}
              onClick={() => setView(m.id)}
              className={`block w-full rounded-lg px-3 py-2 text-left ${current === m.id ? "bg-ink text-cream" : "hover:bg-peach/60"}`}
            >
              {m.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-3 pt-8">
          <div className="text-xs uppercase tracking-wider text-muted">Zalogowany jako</div>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-cream p-1 text-xs font-semibold">
            <button onClick={() => setRole("super")} className={`rounded-lg py-2 ${role === "super" ? "bg-ink text-cream" : ""}`}>Superadmin</button>
            <button onClick={() => setRole("manager")} className={`rounded-lg py-2 ${role === "manager" ? "bg-ink text-cream" : ""}`}>Menedżer</button>
          </div>
          <Link href="/" className="block text-xs text-muted underline">← Strona główna</Link>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <div className="mb-4 flex items-center gap-2 md:hidden">
          <select value={current} onChange={(e) => setView(e.target.value as View)} className="flex-1 rounded-lg border border-line bg-paper px-3 py-2">
            {menu.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
          <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="rounded-lg border border-line bg-paper px-3 py-2">
            <option value="super">Superadmin</option>
            <option value="manager">Menedżer</option>
          </select>
        </div>

        {current === "calendar" && (
          <CalendarView
            weekStart={weekStart}
            setWeekStart={setWeekStart}
            onSelect={setSelected}
            onAdd={(date, start) => setAdding({ date, start })}
          />
        )}
        {current === "prices" && <PricesView />}
        {current === "promos" && <PromosView />}
        {current === "export" && <ExportView weekStart={weekStart} />}
        {!["calendar", "prices", "promos", "export"].includes(current) && <Placeholder view={current} />}
      </main>

      {selected && <BookingDrawer booking={selected} onClose={() => setSelected(null)} />}
      {adding && <AddModal initial={adding} onClose={() => setAdding(null)} />}
    </div>
  );
}

function CalendarView({ weekStart, setWeekStart, onSelect, onAdd }: { weekStart: string; setWeekStart: (s: string) => void; onSelect: (b: Booking) => void; onAdd: (date: string, start: number) => void }) {
  const { bookingsFor, now } = useDemo();
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = todayKey(now);
  const hours = Array.from({ length: CONFIG.closeHour - CONFIG.openHour }, (_, i) => CONFIG.openHour + i);
  const all = days.flatMap((d) => bookingsFor(d));
  const pending = all.filter((b) => b.status === "pending").length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-semibold">Kalendarz</h1>
          <p className="text-sm text-muted">
            {fmtDateShort(days[0])} – {fmtDateShort(days[6])} · {all.length} rezerwacji
            {pending > 0 && <span className="ml-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-ink">{pending} czeka na zadatek</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekStart(addDays(weekStart, -7))} className="rounded-lg bg-paper px-3 py-2 ring-1 ring-line">←</button>
          <button onClick={() => setWeekStart(addDays(today, -((fromKey(today).getDay() + 6) % 7)))} className="rounded-lg bg-paper px-3 py-2 text-sm ring-1 ring-line">Dziś</button>
          <button onClick={() => setWeekStart(addDays(weekStart, 7))} className="rounded-lg bg-paper px-3 py-2 ring-1 ring-line">→</button>
          <button onClick={() => onAdd(today, 18)} className="rounded-lg bg-ember px-4 py-2 text-sm font-semibold text-cream">+ Rezerwacja telefoniczna</button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        {Object.values(STATUS).map((s) => (
          <span key={s.label} className="flex items-center gap-1.5"><span className={`h-3 w-3 rounded ${s.cls}`} />{s.label}</span>
        ))}
        <span className="flex items-center gap-1.5"><span className="hatch h-3 w-3 rounded ring-1 ring-line" />Sprzątanie</span>
        <span className="text-muted">Kliknij puste pole, aby dodać rezerwację</span>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl bg-paper ring-1 ring-line">
        <div className="grid min-w-[860px]" style={{ gridTemplateColumns: `56px repeat(7, 1fr)` }}>
          <div />
          {days.map((d, i) => (
            <div key={d} className={`border-b border-l border-line px-2 py-2 text-center text-sm ${d === today ? "bg-peach/70" : ""}`}>
              <div className="font-semibold">{DAYS_SHORT[i]} {Number(d.slice(8))}</div>
              <div className="text-[10px] text-muted">{isWeekendRate(d) ? `${CONFIG.prices.weekend} zł/h` : `${CONFIG.prices.weekday} zł/h`}</div>
            </div>
          ))}
          <div className="relative">
            {hours.map((h) => (
              <div key={h} className="pr-2 text-right text-[10px] text-muted" style={{ height: HOUR_PX }}>{h}:00</div>
            ))}
          </div>
          {days.map((d) => (
            <div key={d} className="relative border-l border-line" style={{ height: HOUR_PX * hours.length }}>
              {hours.map((h) => (
                <button
                  key={h}
                  onClick={() => onAdd(d, h)}
                  className="block w-full border-t border-line/70 hover:bg-peach/40"
                  style={{ height: HOUR_PX }}
                  aria-label={`Dodaj ${d} ${h}:00`}
                />
              ))}
              {bookingsFor(d).map((b) => (
                <div key={b.id}>
                  <button
                    onClick={() => onSelect(b)}
                    className={`absolute inset-x-1 overflow-hidden rounded-lg p-1.5 text-left text-[11px] leading-tight shadow-sm ${STATUS[b.status].cls}`}
                    style={{ top: (b.start - CONFIG.openHour) * HOUR_PX + 1, height: (b.end - b.start) * HOUR_PX - 2 }}
                  >
                    <div className="font-semibold">{fmtHour(b.start)}–{fmtHour(b.end)}</div>
                    <div className="truncate">{b.name}</div>
                    {b.status !== "blocked" && <div className="truncate opacity-80">{b.guests} os. · {b.source === "phone" ? "☎ telefon" : "🌐 www"}</div>}
                  </button>
                  {b.end < CONFIG.closeHour && (
                    <div className="hatch pointer-events-none absolute inset-x-1 rounded" style={{ top: (b.end - CONFIG.openHour) * HOUR_PX, height: HOUR_PX * CONFIG.bufferHours }} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BookingDrawer({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const { updateBooking, removeBooking } = useDemo();
  const [b, setB] = useState(booking);
  const [msg, setMsg] = useState("");

  function patch(p: Partial<Booking>, note: string) {
    updateBooking(b.id, p);
    setB({ ...b, ...p });
    setMsg(note);
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-ink/30" onClick={onClose}>
      <div className="h-full w-full max-w-md overflow-y-auto bg-paper p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS[b.status].cls}`}>{STATUS[b.status].label}</span>
            <h2 className="mt-3 font-display text-3xl font-semibold">{b.name}</h2>
            <p className="text-muted first-letter:uppercase">{fmtDate(b.date)}, {fmtHour(b.start)}–{fmtHour(b.end)}</p>
          </div>
          <button onClick={onClose} className="text-2xl text-muted">✕</button>
        </div>
        <dl className="mt-6 space-y-2 text-sm">
          <Item k="Telefon" v={b.phone || "—"} />
          <Item k="Źródło" v={b.source === "phone" ? "Telefon (wpisał menedżer)" : "Strona www"} />
          <Item k="Goście" v={String(b.guests)} />
          <Item k="Balia" v={b.tubHours ? `${b.tubHours} h` : "—"} />
          <Item k="Dodatki" v={b.extras.length ? b.extras.join(", ") : "—"} />
        </dl>
        {msg && <div className="mt-5 rounded-xl bg-moss/15 p-3 text-sm text-moss">{msg}</div>}
        <div className="mt-6 grid gap-2 text-sm font-semibold">
          {b.status === "pending" && (
            <>
              <button onClick={() => setMsg(`SMS z linkiem do zadatku wysłany ponownie na ${b.phone} (demo).`)} className="rounded-xl bg-ink py-3 text-cream">Wyślij ponownie link do zadatku</button>
              <button onClick={() => patch({ status: "paid" }, "Oznaczono: zadatek opłacony (gotówka/przelew).")} className="rounded-xl bg-moss py-3 text-cream">Oznacz zadatek jako opłacony</button>
            </>
          )}
          <button onClick={() => setMsg("Przeniesienie terminu — w pełnej wersji przeciągasz rezerwację w kalendarzu.")} className="rounded-xl bg-cream py-3 ring-1 ring-line">Przenieś termin</button>
          <button onClick={() => { removeBooking(b.id); onClose(); }} className="rounded-xl py-3 text-ember ring-1 ring-ember/40">Anuluj rezerwację</button>
        </div>
      </div>
    </div>
  );
}

function AddModal({ initial, onClose }: { initial: { date: string; start: number }; onClose: () => void }) {
  const { addBooking, bookingsFor, now, settings } = useDemo();
  const [f, setF] = useState({ date: initial.date, start: initial.start, hours: 3, name: "", phone: "", guests: 4, sms: true, kind: "booking" as "booking" | "block" });
  const [done, setDone] = useState("");

  const check = useMemo(() => {
    const slots = daySlots({ date: f.date, duration: f.hours, bookings: bookingsFor(f.date), now, season: settings.season, keepEvening: settings.keepEvening });
    return slots.find((s) => s.start === f.start);
  }, [f.date, f.hours, f.start, bookingsFor, now, settings.season, settings.keepEvening]);
  const busy = !check || check.reason === "busy";

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    addBooking({
      id: `tel-${Date.now()}`,
      date: f.date,
      start: f.start,
      end: f.start + f.hours,
      status: f.kind === "block" ? "blocked" : "pending",
      source: "phone",
      name: f.kind === "block" ? "Blokada terminu" : f.name,
      phone: f.phone,
      guests: f.guests,
      tubHours: 0,
      extras: [],
      total: 0,
    });
    setDone(
      f.kind === "block"
        ? "Termin zablokowany — nie będzie widoczny na stronie."
        : f.sms
          ? `Rezerwacja dodana. SMS z linkiem do zadatku ${CONFIG.deposit} zł wysłany na ${f.phone}. Gość ma 1 h na płatność — potem przypomnienie, a bez odpowiedzi rezerwacja jest anulowana.`
          : "Rezerwacja dodana bez SMS.",
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 p-4" onClick={onClose}>
      <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-3xl bg-paper p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl font-semibold">Nowy wpis</h2>
          <button type="button" onClick={onClose} className="text-2xl text-muted">✕</button>
        </div>
        {done ? (
          <>
            <p className="mt-4 rounded-2xl bg-moss/15 p-4 text-sm text-moss">{done}</p>
            <button type="button" onClick={onClose} className="mt-4 w-full rounded-xl bg-ink py-3 font-semibold text-cream">Gotowe</button>
          </>
        ) : (
          <div className="mt-4 space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-cream p-1 font-semibold">
              <button type="button" onClick={() => setF({ ...f, kind: "booking" })} className={`rounded-lg py-2 ${f.kind === "booking" ? "bg-ink text-cream" : ""}`}>Rezerwacja</button>
              <button type="button" onClick={() => setF({ ...f, kind: "block" })} className={`rounded-lg py-2 ${f.kind === "block" ? "bg-ink text-cream" : ""}`}>Blokada terminu</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <label className="col-span-3 block sm:col-span-1">Dzień
                <input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} className="mt-1 w-full rounded-lg border border-line bg-cream px-2 py-2" />
              </label>
              <label className="block">Od
                <select value={f.start} onChange={(e) => setF({ ...f, start: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-line bg-cream px-2 py-2">
                  {Array.from({ length: 11 }, (_, i) => 12 + i).map((h) => <option key={h} value={h}>{h}:00</option>)}
                </select>
              </label>
              <label className="block">Godzin
                <select value={f.hours} onChange={(e) => setF({ ...f, hours: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-line bg-cream px-2 py-2">
                  {[2, 3, 4, 5, 6, 8, 10, 12].filter((h) => f.start + h <= 24).map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </label>
            </div>
            {busy ? (
              <p className="rounded-lg bg-ember/10 p-2 text-ember">Ten termin koliduje z inną rezerwacją lub sprzątaniem.</p>
            ) : !check?.ok ? (
              <p className="rounded-lg bg-amber-100 p-2 text-amber-900">Uwaga: {check?.detail} Menedżer może mimo to dodać rezerwację.</p>
            ) : (
              <p className="rounded-lg bg-moss/10 p-2 text-moss">Termin wolny i zgodny z regułami.</p>
            )}
            {f.kind === "booking" && (
              <>
                <label className="block">Imię i nazwisko
                  <input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2" />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block">Telefon
                    <input required value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2" />
                  </label>
                  <label className="block">Goście
                    <select value={f.guests} onChange={(e) => setF({ ...f, guests: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-line bg-cream px-2 py-2">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => <option key={n}>{n}</option>)}
                    </select>
                  </label>
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={f.sms} onChange={(e) => setF({ ...f, sms: e.target.checked })} />
                  Wyślij gościowi SMS z linkiem do zadatku {CONFIG.deposit} zł
                </label>
              </>
            )}
            <button disabled={busy} className="w-full rounded-xl bg-ember py-3 font-semibold text-cream disabled:opacity-30">Zapisz</button>
          </div>
        )}
      </form>
    </div>
  );
}

function PricesView() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl font-semibold">Ceny i święta</h1>
      <p className="text-sm text-muted">Zmiany od razu działają na stronie — bez programisty.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Bania Pn–Czw (zł/h)" value={CONFIG.prices.weekday} />
        <Field label="Bania Pt–Nd i święta (zł/h)" value={CONFIG.prices.weekend} />
        <Field label="Balia (zł/h)" value={CONFIG.prices.tubPerHour} />
        <Field label="Zniżka od godziny nr" value={CONFIG.prices.discountFromHour} />
        <Field label="Zniżka (%)" value={CONFIG.prices.discount * 100} />
        <Field label="Zadatek (zł)" value={CONFIG.deposit} />
        <Field label="Dopłata za gościa ponad 6 (zł/h)" value={CONFIG.extraGuestPerHour} />
        <Field label="Sprzątanie między rezerwacjami (h)" value={CONFIG.bufferHours} />
        <Field label="Rozpalenie, gdy bania zimna (h)" value={CONFIG.leadColdHours} />
        <Field label="Przygotowanie, gdy bania ciepła (h)" value={CONFIG.leadWarmHours} />
      </div>
      <div className="mt-6 rounded-2xl bg-paper p-5 ring-1 ring-line">
        <div className="font-semibold">Sezon wysoki</div>
        <p className="text-sm text-muted">Wrzesień – marzec · inteligentne okna włączone · „trzymaj wieczór wolny” przy obłożeniu ≤ 30%</p>
      </div>
      <div className="mt-4 rounded-2xl bg-paper p-5 ring-1 ring-line">
        <div className="font-semibold">Święta (taryfa weekendowa)</div>
        <p className="text-sm text-muted">11 listopada, 24–26 grudnia, 1 i 6 stycznia, Wielkanoc… + dodaj własne daty</p>
      </div>
    </div>
  );
}

function PromosView() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl font-semibold">Kody i bony</h1>
      <p className="text-sm text-muted">Kod jednorazowy dezaktywuje się automatycznie po użyciu. Bon podarunkowy = unikalny kod na 100%.</p>
      <div className="mt-6 divide-y divide-line rounded-2xl bg-paper ring-1 ring-line">
        {PROMOS.map((p) => (
          <div key={p.code} className="flex items-center justify-between p-4">
            <div>
              <div className="font-mono font-semibold">{p.code}</div>
              <div className="text-sm text-muted">{p.label}</div>
            </div>
            <span className="rounded-full bg-moss/15 px-3 py-1 text-xs font-semibold text-moss">aktywny</span>
          </div>
        ))}
      </div>
      <button className="mt-4 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-cream">+ Wygeneruj bon podarunkowy</button>
    </div>
  );
}

function ExportView({ weekStart }: { weekStart: string }) {
  const { bookingsFor } = useDemo();
  function download() {
    const rows = [["Data", "Od", "Do", "Godzin", "Gość", "Telefon", "Goście", "Źródło", "Status"]];
    for (let i = 0; i < 31; i++) {
      const d = addDays(weekStart, i);
      for (const b of bookingsFor(d)) rows.push([d, fmtHour(b.start), fmtHour(b.end), String(b.end - b.start), b.name, b.phone, String(b.guests), b.source, b.status]);
    }
    const csv = "﻿" + rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(";")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `bania-rezerwacje-${weekStart}.csv`;
    a.click();
  }
  return (
    <div className="max-w-xl">
      <h1 className="font-display text-4xl font-semibold">Eksport do Excela</h1>
      <p className="mt-2 text-muted">Rezerwacje z wybranego okresu w formacie, który otworzysz w Excelu. Kolumny dopasujemy do Waszego obecnego pliku.</p>
      <button onClick={download} className="mt-6 rounded-xl bg-ink px-5 py-3 font-semibold text-cream">Pobierz 31 dni od {fmtDateShort(weekStart)}</button>
    </div>
  );
}

function Placeholder({ view }: { view: View }) {
  const text: Partial<Record<View, { t: string; d: string[] }>> = {
    services: { t: "Usługi i dodatki", d: ADDONS.map((a) => `${a.name} — ${a.price === null ? "cena do ustalenia" : `${a.price} zł / ${a.unit}`}`) },
    templates: { t: "Szablony SMS i e-mail", d: ["Potwierdzenie rezerwacji", "Link do zadatku (rezerwacja telefoniczna)", "Przypomnienie o zadatku po 1 h", "Anulowanie — brak zadatku", "Przypomnienie 24 h przed wizytą", "Każdy szablon w 3 językach: PL / RU / EN"] },
    content: { t: "Treści strony", d: ["Strona główna, o nas, cennik", "Galeria — dodawanie i kolejność zdjęć", "Regulamin i FAQ", "Oferty pracy", "Wszystko w wersjach PL / RU / EN"] },
    blacklist: { t: "Czarna lista", d: ["Numer telefonu lub e-mail", "Gość nie może dokończyć rezerwacji online — widzi neutralny komunikat z prośbą o kontakt telefoniczny", "Odblokowanie jednym kliknięciem"] },
    users: { t: "Użytkownicy i role", d: ["Superadmin — pełny dostęp", "Menedżer — kalendarz, rezerwacje telefoniczne, blokady terminów"] },
  };
  const c = text[view];
  return (
    <div className="max-w-xl">
      <h1 className="font-display text-4xl font-semibold">{c?.t}</h1>
      <ul className="mt-6 space-y-2">
        {c?.d.map((x) => <li key={x} className="rounded-xl bg-paper p-3 text-sm ring-1 ring-line">{x}</li>)}
      </ul>
      <p className="mt-4 text-xs text-muted">Sekcja dostępna w pełnej wersji.</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: number }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input defaultValue={value} className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2.5" />
    </label>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line pb-2">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}
