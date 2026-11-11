"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ADDONS, CONFIG } from "@/lib/config";
import { activePromo, isBlacklisted, type AdminSettings } from "@/lib/admin";
import { addDays, DAYS_SHORT, fmtDate, fmtDateShort, fmtHour, fromKey, isWeekendRate, monthName, todayKey, toKey } from "@/lib/dates";
import type { Booking } from "@/lib/bookings";
import { daySlots } from "@/lib/slots";
import { useDemo } from "@/lib/store";
import { Logo } from "@/components/Logo";

type Role = "super" | "manager";
type View = "calendar" | "export" | "prices" | "services" | "promos" | "blacklist" | "templates" | "content" | "settings" | "users";
type CalMode = "day" | "week" | "month";

const MENU: { id: View; label: string; super?: boolean }[] = [
  { id: "calendar", label: "Kalendarz" },
  { id: "export", label: "Eksport do Excela" },
  { id: "prices", label: "Ceny i święta", super: true },
  { id: "services", label: "Usługi i dodatki", super: true },
  { id: "promos", label: "Kody promocyjne", super: true },
  { id: "blacklist", label: "Czarna lista", super: true },
  { id: "templates", label: "Szablony SMS i e-mail", super: true },
  { id: "content", label: "Treści strony", super: true },
  { id: "settings", label: "Zadatek i płatności", super: true },
  { id: "users", label: "Użytkownicy i role", super: true },
];

// Statusy z TZ: potwierdzona / tymczasowo zablokowana / ręczna + blokada techniczna
type Status = "confirmed" | "manual" | "pending" | "blocked";
const STATUS: Record<Status, { label: string; cls: string }> = {
  confirmed: { label: "Potwierdzona (online)", cls: "bg-moss text-cream" },
  manual: { label: "Ręczna rezerwacja", cls: "bg-wood text-cream" },
  pending: { label: "Tymczasowo zablokowana — czeka na zadatek", cls: "bg-amber-400 text-ink" },
  blocked: { label: "Blokada techniczna", cls: "bg-neutral-400 text-ink" },
};

function statusOf(b: Booking): Status {
  if (b.status === "blocked") return "blocked";
  if (b.status === "pending") return "pending";
  return b.source === "phone" ? "manual" : "confirmed";
}

const HOUR_PX = 44;

export function AdminApp() {
  const { ready } = useDemo();
  return ready ? <AdminInner /> : <div className="py-32 text-center text-muted">Ładowanie…</div>;
}

function AdminInner() {
  const { now, admin } = useDemo();
  const [role, setRole] = useState<Role>("manager");
  const [pinAsk, setPinAsk] = useState(false);
  const [view, setView] = useState<View>("calendar");
  const [mode, setMode] = useState<CalMode>("week");
  const [cursor, setCursor] = useState(() => todayKey(now));
  const [selected, setSelected] = useState<Booking | null>(null);
  const [adding, setAdding] = useState<{ date: string; start: number } | null>(null);

  const menu = MENU.filter((m) => role === "super" || !m.super);
  const current = menu.some((m) => m.id === view) ? view : "calendar";

  function switchRole(r: Role) {
    if (r === "super" && role !== "super") setPinAsk(true);
    else setRole(r);
  }

  return (
    <div className="flex min-h-screen bg-[#f6efe7] text-ink">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-line bg-paper p-5 md:flex">
        <div className="flex items-center gap-3">
          <Logo size={48} />
          <div>
            <div className="font-semibold">Panel</div>
            <div className="text-xs text-muted">The Bania · demo</div>
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-1.5 text-xs uppercase tracking-wider text-muted">Zalogowany jako</div>
          <RoleSwitch role={role} onChange={switchRole} />
        </div>
        <nav className="mt-6 space-y-1 border-t border-line pt-5 text-sm">
          {menu.map((m) => (
            <button
              key={m.id}
              onClick={() => setView(m.id)}
              className={`block w-full rounded-lg px-3 py-2 text-left ${current === m.id ? "bg-ink text-cream" : "hover:bg-peach/60"}`}
            >
              {m.label}
            </button>
          ))}
          {role === "manager" && <p className="px-3 pt-3 text-xs text-muted">🔒 Ustawienia, ceny i kody dostępne po wpisaniu PIN-u właściciela.</p>}
        </nav>
        <div className="mt-auto pt-8">
          <Link href="/" className="block text-xs text-muted underline">← Strona główna</Link>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <div className="mb-4 flex items-center gap-2 md:hidden">
          <select value={current} onChange={(e) => setView(e.target.value as View)} className="flex-1 rounded-lg border border-line bg-paper px-3 py-2">
            {menu.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
          <RoleSwitch role={role} onChange={switchRole} />
        </div>

        {current === "calendar" && (
          <CalendarView mode={mode} setMode={setMode} cursor={cursor} setCursor={setCursor} onSelect={setSelected} onAdd={(date, start) => setAdding({ date, start })} />
        )}
        {current === "export" && <ExportView from={cursor} />}
        {current === "prices" && <PricesView />}
        {current === "services" && <ServicesView />}
        {current === "promos" && <PromosView />}
        {current === "blacklist" && <BlacklistView />}
        {current === "templates" && <TemplatesView />}
        {current === "content" && <ContentView />}
        {current === "settings" && <SettingsView />}
        {current === "users" && <UsersView />}
      </main>

      {selected && <BookingDrawer booking={selected} canBan={role === "super"} onClose={() => setSelected(null)} />}
      {adding && <AddModal initial={adding} onClose={() => setAdding(null)} />}
      {pinAsk && (
        <PinModal
          pin={admin.pin}
          onClose={() => setPinAsk(false)}
          onOk={() => {
            setRole("super");
            setPinAsk(false);
          }}
        />
      )}
    </div>
  );
}

function RoleSwitch({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-xl bg-cream p-1 text-xs font-semibold">
      <button onClick={() => onChange("manager")} className={`rounded-lg px-2 py-2 ${role === "manager" ? "bg-ink text-cream" : ""}`}>Menedżer</button>
      <button onClick={() => onChange("super")} className={`rounded-lg px-2 py-2 ${role === "super" ? "bg-ink text-cream" : ""}`}>Właściciel</button>
    </div>
  );
}

/* ───────────────────────── KALENDARZ ───────────────────────── */

function CalendarView({
  mode,
  setMode,
  cursor,
  setCursor,
  onSelect,
  onAdd,
}: {
  mode: CalMode;
  setMode: (m: CalMode) => void;
  cursor: string;
  setCursor: (d: string) => void;
  onSelect: (b: Booking) => void;
  onAdd: (date: string, start: number) => void;
}) {
  const { bookingsFor, now } = useDemo();
  const today = todayKey(now);
  const weekStart = addDays(cursor, -((fromKey(cursor).getDay() + 6) % 7));

  function shift(dir: 1 | -1) {
    if (mode === "day") setCursor(addDays(cursor, dir));
    else if (mode === "week") setCursor(addDays(cursor, 7 * dir));
    else {
      const d = fromKey(cursor);
      setCursor(toKey(new Date(d.getFullYear(), d.getMonth() + dir, 1)));
    }
  }

  const days = mode === "day" ? [cursor] : Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const title =
    mode === "day" ? fmtDate(cursor) : mode === "week" ? `${fmtDateShort(days[0])} – ${fmtDateShort(days[6])}` : monthName(fromKey(cursor).getFullYear(), fromKey(cursor).getMonth());
  const pending = days.flatMap((d) => bookingsFor(d)).filter((b) => b.status === "pending").length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">Kalendarz</h1>
          <p className="text-sm text-muted first-letter:uppercase">
            {title}
            {mode !== "month" && pending > 0 && <span className="ml-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-ink">{pending} czeka na zadatek</span>}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-paper p-1 text-sm font-semibold ring-1 ring-line">
            {(["day", "week", "month"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`rounded-lg px-3 py-1.5 ${mode === m ? "bg-ink text-cream" : ""}`}>
                {m === "day" ? "Dzień" : m === "week" ? "Tydzień" : "Miesiąc"}
              </button>
            ))}
          </div>
          <button onClick={() => shift(-1)} className="rounded-lg bg-paper px-3 py-2 ring-1 ring-line" aria-label="Wstecz">←</button>
          <button onClick={() => setCursor(today)} className="rounded-lg bg-paper px-3 py-2 text-sm ring-1 ring-line">Dziś</button>
          <button onClick={() => shift(1)} className="rounded-lg bg-paper px-3 py-2 ring-1 ring-line" aria-label="Dalej">→</button>
          <button onClick={() => onAdd(mode === "day" ? cursor : today, 18)} className="rounded-lg bg-ember px-4 py-2 text-sm font-semibold text-white">+ Rezerwacja ręczna</button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
        {Object.values(STATUS).map((s) => (
          <span key={s.label} className="flex items-center gap-1.5"><span className={`h-3 w-3 rounded ${s.cls}`} />{s.label}</span>
        ))}
        <span className="flex items-center gap-1.5"><span className="hatch h-3 w-3 rounded ring-1 ring-line" />Sprzątanie</span>
      </div>

      {mode === "month" ? (
        <MonthGrid cursor={cursor} today={today} onPickDay={(d) => { setCursor(d); setMode("day"); }} />
      ) : (
        <TimeGrid days={days} today={today} onSelect={onSelect} onAdd={onAdd} />
      )}
      {mode !== "month" && <p className="mt-2 text-xs text-muted">Kliknij puste pole, aby dodać rezerwację lub blokadę.</p>}
    </div>
  );
}

function TimeGrid({ days, today, onSelect, onAdd }: { days: string[]; today: string; onSelect: (b: Booking) => void; onAdd: (date: string, start: number) => void }) {
  const { bookingsFor, admin } = useDemo();
  const hours = Array.from({ length: CONFIG.closeHour - CONFIG.openHour }, (_, i) => CONFIG.openHour + i);
  const single = days.length === 1;

  return (
    <div className="mt-4 overflow-x-auto rounded-2xl bg-paper ring-1 ring-line">
      <div className={`grid ${single ? "" : "min-w-[860px]"}`} style={{ gridTemplateColumns: `56px repeat(${days.length}, 1fr)` }}>
        <div />
        {days.map((d) => (
          <div key={d} className={`border-b border-l border-line px-2 py-2 text-center text-sm ${d === today ? "bg-peach/70" : ""}`}>
            <div className="font-semibold">{DAYS_SHORT[(fromKey(d).getDay() + 6) % 7]} {Number(d.slice(8))}</div>
            <div className="text-[10px] text-muted">{isWeekendRate(d, admin.holidays) ? `${admin.weekend} zł/h` : `${admin.weekday} zł/h`}</div>
          </div>
        ))}
        <div>
          {hours.map((h) => (
            <div key={h} className="pr-2 text-right text-[10px] text-muted" style={{ height: HOUR_PX }}>{h}:00</div>
          ))}
        </div>
        {days.map((d) => (
          <div key={d} className="relative border-l border-line" style={{ height: HOUR_PX * hours.length }}>
            {hours.map((h) => (
              <button key={h} onClick={() => onAdd(d, h)} className="block w-full border-t border-line/70 hover:bg-peach/40" style={{ height: HOUR_PX }} aria-label={`Dodaj ${d} ${h}:00`} />
            ))}
            {bookingsFor(d).map((b) => {
              const st = statusOf(b);
              return (
                <div key={b.id}>
                  <button
                    onClick={() => onSelect(b)}
                    className={`absolute inset-x-1 overflow-hidden rounded-lg p-1.5 text-left text-[11px] leading-tight shadow-sm ${STATUS[st].cls}`}
                    style={{ top: (b.start - CONFIG.openHour) * HOUR_PX + 1, height: (b.end - b.start) * HOUR_PX - 2 }}
                  >
                    <div className="font-semibold">{fmtHour(b.start)}–{fmtHour(b.end)}</div>
                    <div className="truncate">{b.name}</div>
                    {b.status !== "blocked" && (
                      <div className="truncate opacity-80">
                        {b.guests} os. · {b.source === "phone" ? "☎ ręczna" : "🌐 online"}
                        {single && b.extras.length > 0 && ` · ${b.extras.join(", ")}`}
                      </div>
                    )}
                  </button>
                  {b.end < CONFIG.closeHour && (
                    <div className="hatch pointer-events-none absolute inset-x-1 rounded" style={{ top: (b.end - CONFIG.openHour) * HOUR_PX, height: HOUR_PX * CONFIG.bufferHours }} />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthGrid({ cursor, today, onPickDay }: { cursor: string; today: string; onPickDay: (d: string) => void }) {
  const { bookingsFor, admin } = useDemo();
  const c = fromKey(cursor);
  const first = new Date(c.getFullYear(), c.getMonth(), 1);
  const lead = (first.getDay() + 6) % 7;
  const n = new Date(c.getFullYear(), c.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length: n }, (_, i) => toKey(new Date(c.getFullYear(), c.getMonth(), i + 1)))];

  return (
    <div className="mt-4 rounded-2xl bg-paper p-2 ring-1 ring-line">
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-muted">
        {DAYS_SHORT.map((d) => <div key={d} className="py-2">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const bs = bookingsFor(d);
          return (
            <button
              key={d}
              onClick={() => onPickDay(d)}
              className={`min-h-24 rounded-lg p-1.5 text-left align-top ring-1 transition hover:ring-ink ${d === today ? "bg-peach/70 ring-ember" : "bg-cream ring-line"}`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold">{Number(d.slice(8))}</span>
                {isWeekendRate(d, admin.holidays) && <span className="text-[10px] text-muted">{admin.weekend} zł</span>}
              </div>
              <div className="mt-1 space-y-0.5">
                {bs.slice(0, 3).map((b) => (
                  <div key={b.id} className={`truncate rounded px-1 text-[10px] ${STATUS[statusOf(b)].cls}`}>
                    {fmtHour(b.start)} {b.name.split(" ")[0]}
                  </div>
                ))}
                {bs.length > 3 && <div className="text-[10px] text-muted">+{bs.length - 3}</div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BookingDrawer({ booking, canBan, onClose }: { booking: Booking; canBan: boolean; onClose: () => void }) {
  const { updateBooking, removeBooking, bookingsFor, now, settings, admin, setAdmin } = useDemo();
  const [b, setB] = useState(booking);
  const [msg, setMsg] = useState("");
  const [moving, setMoving] = useState(false);
  const [mv, setMv] = useState({ date: booking.date, start: booking.start });
  const banned = b.phone ? isBlacklisted(admin, b.phone, "") : false;
  const st = statusOf(b);

  function patch(p: Partial<Booking>, note: string) {
    updateBooking(b.id, p);
    setB({ ...b, ...p });
    setMsg(note);
  }

  const dur = b.end - b.start;
  const moveCheck = useMemo(() => {
    const others = bookingsFor(mv.date).filter((x) => x.id !== b.id);
    return daySlots({ date: mv.date, duration: dur, bookings: others, now, season: settings.season, keepEvening: false }).find((s) => s.start === mv.start);
  }, [mv, b.id, dur, bookingsFor, now, settings.season]);
  const moveBusy = !moveCheck || moveCheck.reason === "busy";

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-ink/30" onClick={onClose}>
      <div className="h-full w-full max-w-md overflow-y-auto bg-paper p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS[st].cls}`}>{STATUS[st].label}</span>
            {banned && <span className="ml-2 rounded-full bg-ember px-2.5 py-1 text-xs font-semibold text-white">Czarna lista</span>}
            <h2 className="mt-3 font-display text-3xl">{b.name}</h2>
            <p className="text-muted first-letter:uppercase">{fmtDate(b.date)}, {fmtHour(b.start)}–{fmtHour(b.end)}</p>
          </div>
          <button onClick={onClose} className="text-2xl text-muted" aria-label="Zamknij">✕</button>
        </div>
        <dl className="mt-6 space-y-2 text-sm">
          <Item k="Telefon" v={b.phone || "—"} />
          <Item k="Źródło" v={b.source === "phone" ? "Ręczna (wpisał menedżer)" : "Strona www"} />
          <Item k="Goście" v={String(b.guests)} />
          <Item k="Dodatki" v={b.extras.length ? b.extras.join(", ") : "—"} />
        </dl>
        {msg && <div className="mt-5 rounded-xl bg-moss/15 p-3 text-sm text-moss">{msg}</div>}

        {moving ? (
          <div className="mt-6 space-y-3 rounded-2xl bg-cream p-4 text-sm ring-1 ring-line">
            <div className="font-semibold">Przenieś na</div>
            <div className="grid grid-cols-2 gap-2">
              <input type="date" value={mv.date} onChange={(e) => setMv({ ...mv, date: e.target.value })} className="rounded-lg border border-line bg-paper px-2 py-2" />
              <select value={mv.start} onChange={(e) => setMv({ ...mv, start: Number(e.target.value) })} className="rounded-lg border border-line bg-paper px-2 py-2">
                {Array.from({ length: CONFIG.closeHour - CONFIG.openHour - dur + 1 }, (_, i) => CONFIG.openHour + i).map((h) => (
                  <option key={h} value={h}>{fmtHour(h)}–{fmtHour(h + dur)}</option>
                ))}
              </select>
            </div>
            {moveBusy ? <p className="text-ember">Ten termin koliduje z inną rezerwacją.</p> : <p className="text-moss">Termin wolny.</p>}
            <div className="flex gap-2">
              <button
                disabled={moveBusy}
                onClick={() => {
                  patch({ date: mv.date, start: mv.start, end: mv.start + dur }, `Przeniesiono na ${fmtDateShort(mv.date)}, ${fmtHour(mv.start)}. Gość dostanie SMS o zmianie (demo).`);
                  setMoving(false);
                }}
                className="flex-1 rounded-xl bg-ink py-2.5 font-semibold text-cream disabled:opacity-30"
              >
                Zapisz
              </button>
              <button onClick={() => setMoving(false)} className="rounded-xl px-4 py-2.5 ring-1 ring-line">Anuluj</button>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-2 text-sm font-semibold">
            {b.status === "pending" && (
              <>
                <button onClick={() => setMsg(`SMS z linkiem do zadatku wysłany ponownie na ${b.phone} (demo).`)} className="rounded-xl bg-ink py-3 text-cream">Wyślij ponownie link do zadatku</button>
                <button onClick={() => patch({ status: "paid" }, "Oznaczono: zadatek opłacony (gotówka/przelew).")} className="rounded-xl bg-moss py-3 text-cream">Oznacz zadatek jako opłacony</button>
              </>
            )}
            <button onClick={() => setMoving(true)} className="rounded-xl bg-cream py-3 ring-1 ring-line">Przenieś termin</button>
            <button onClick={() => { removeBooking(b.id); onClose(); }} className="rounded-xl py-3 text-ember ring-1 ring-ember/40">Anuluj rezerwację</button>
            {b.phone && canBan && !banned && (
              <button
                onClick={() => {
                  setAdmin({ blacklist: [...admin.blacklist, { value: b.phone, note: `${b.name}, ${fmtDateShort(b.date)}` }] });
                  setMsg("Gość dodany do czarnej listy — nie zarezerwuje już online.");
                }}
                className="rounded-xl py-3 text-muted ring-1 ring-line hover:text-ember"
              >
                Zablokuj gościa (czarna lista)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AddModal({ initial, onClose }: { initial: { date: string; start: number }; onClose: () => void }) {
  const { addBooking, bookingsFor, now, settings, admin } = useDemo();
  const [f, setF] = useState({ date: initial.date, start: initial.start, hours: 3, name: "", phone: "", guests: 4, sms: true, kind: "booking" as "booking" | "block" });
  const [done, setDone] = useState("");

  const check = useMemo(() => {
    const slots = daySlots({ date: f.date, duration: f.hours, bookings: bookingsFor(f.date), now, season: settings.season, keepEvening: settings.keepEvening });
    return slots.find((s) => s.start === f.start);
  }, [f.date, f.hours, f.start, bookingsFor, now, settings.season, settings.keepEvening]);
  const busy = !check || check.reason === "busy";
  const banned = f.kind === "booking" && f.phone ? isBlacklisted(admin, f.phone, "") : false;

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    addBooking({
      id: `tel-${f.date}-${f.start}-${f.phone || "blok"}`,
      date: f.date,
      start: f.start,
      end: f.start + f.hours,
      status: f.kind === "block" ? "blocked" : f.sms ? "pending" : "paid",
      source: "phone",
      name: f.kind === "block" ? "Blokada techniczna" : f.name,
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
          ? `Rezerwacja dodana. SMS z linkiem do zadatku ${admin.deposit} zł wysłany na ${f.phone}. Gość ma 1 h na płatność — potem przypomnienie, a bez odpowiedzi rezerwacja jest anulowana.`
          : "Rezerwacja dodana jako opłacona (zadatek przyjęty na miejscu / przelewem).",
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 p-4" onClick={onClose}>
      <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-3xl bg-paper p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl">Nowy wpis</h2>
          <button type="button" onClick={onClose} className="text-2xl text-muted" aria-label="Zamknij">✕</button>
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
              <button type="button" onClick={() => setF({ ...f, kind: "block" })} className={`rounded-lg py-2 ${f.kind === "block" ? "bg-ink text-cream" : ""}`}>Blokada techniczna</button>
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
                {banned && <p className="rounded-lg bg-ember/10 p-2 font-semibold text-ember">Ten numer jest na czarnej liście.</p>}
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={f.sms} onChange={(e) => setF({ ...f, sms: e.target.checked })} />
                  Wyślij gościowi SMS z linkiem do zadatku {admin.deposit} zł
                </label>
              </>
            )}
            <button disabled={busy} className="w-full rounded-xl bg-ember py-3 font-semibold text-white disabled:opacity-30">Zapisz</button>
          </div>
        )}
      </form>
    </div>
  );
}

/* ───────────────────────── USTAWIENIA ───────────────────────── */

function Page({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl">{title}</h1>
      {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function NumField({ label, value, onChange, suffix }: { label: string; value: number | null; onChange: (v: number | null) => void; suffix?: string }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <div className="mt-1 flex items-center rounded-xl border border-line bg-paper pr-3">
        <input
          type="number"
          min={0}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
          className="w-full rounded-xl bg-transparent px-3 py-2.5"
        />
        {suffix && <span className="shrink-0 text-muted">{suffix}</span>}
      </div>
    </label>
  );
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2.5" />
    </label>
  );
}

function Saved() {
  return <p className="mt-4 text-xs text-moss">✓ Zmiany zapisują się automatycznie i od razu działają na stronie rezerwacji (demo).</p>;
}

function PricesView() {
  const { admin, setAdmin } = useDemo();
  const [newDay, setNewDay] = useState("");
  return (
    <Page title="Ceny i święta" sub="Taryfy bazowe za cały obiekt do 6 osób. Od 3. godziny −50%.">
      <div className="grid gap-4 sm:grid-cols-3">
        <NumField label="Bania Pn–Czw" value={admin.weekday} suffix="zł/h" onChange={(v) => setAdmin({ weekday: v ?? 0 })} />
        <NumField label="Bania Pt–Nd i święta" value={admin.weekend} suffix="zł/h" onChange={(v) => setAdmin({ weekend: v ?? 0 })} />
        <NumField label="Gorąca beczka" value={admin.tubPerHour} suffix="zł/h" onChange={(v) => setAdmin({ tubPerHour: v ?? 0 })} />
      </div>
      <Saved />

      <h2 className="mt-10 font-display text-2xl">Święta i dni specjalne</h2>
      <p className="mt-1 text-sm text-muted">W te dni automatycznie obowiązuje taryfa weekendowa, niezależnie od dnia tygodnia.</p>
      <div className="mt-4 flex gap-2">
        <input type="date" value={newDay} onChange={(e) => setNewDay(e.target.value)} className="rounded-xl border border-line bg-paper px-3 py-2" />
        <button
          disabled={!newDay || admin.holidays.includes(newDay)}
          onClick={() => {
            setAdmin({ holidays: [...admin.holidays, newDay].sort() });
            setNewDay("");
          }}
          className="rounded-xl bg-ink px-4 font-semibold text-cream disabled:opacity-30"
        >
          + Dodaj dzień
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {admin.holidays.map((d) => (
          <span key={d} className="flex items-center gap-2 rounded-full bg-paper py-1 pl-3 pr-1 text-sm ring-1 ring-line">
            {fmtDateShort(d)} {d.slice(0, 4)}
            <button onClick={() => setAdmin({ holidays: admin.holidays.filter((x) => x !== d) })} className="h-6 w-6 rounded-full text-muted hover:bg-peach" aria-label={`Usuń ${d}`}>×</button>
          </span>
        ))}
      </div>
    </Page>
  );
}

function ServicesView() {
  const { admin, setAdmin } = useDemo();
  return (
    <Page title="Usługi i dodatki" sub="Puste pole ceny = „cena do ustalenia”. W pełnej wersji także dodawanie nowych usług i reguł.">
      <div className="divide-y divide-line rounded-2xl bg-paper ring-1 ring-line">
        {ADDONS.map((a) => (
          <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <div className="font-semibold">{a.name}</div>
              <div className="text-xs text-muted">
                {a.id === "parmistrz" ? "Wymaga min. 2 witek dębowych w zamówieniu" : a.id === "grill" ? "Maks. 1 na rezerwację" : `Za ${a.unit}`}
              </div>
            </div>
            <div className="w-40">
              <NumField
                label=""
                value={a.id in admin.addonPrices ? admin.addonPrices[a.id] : a.price}
                suffix="zł"
                onChange={(v) => setAdmin({ addonPrices: { ...admin.addonPrices, [a.id]: v } })}
              />
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between p-4 text-sm">
          <div>
            <div className="font-semibold">Gorąca beczka</div>
            <div className="text-xs text-muted">Minimum 2 h, wybór godzin w ramach rezerwacji</div>
          </div>
          <span className="text-muted">Cena w „Ceny i święta”</span>
        </div>
      </div>
      <Saved />
    </Page>
  );
}

function PromosView() {
  const { admin, setAdmin } = useDemo();
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState(10);
  const active = admin.promos.filter((p) => activePromo(admin, p.code));

  function add(c: string, pct: number) {
    const clean = c.trim().toUpperCase();
    if (!clean || admin.promos.some((p) => p.code === clean)) return;
    setAdmin({ promos: [...admin.promos, { code: clean, percent: pct, label: pct === 100 ? "Bon podarunkowy (jednorazowy)" : `−${pct}% na całą rezerwację` }] });
    setCode("");
  }

  return (
    <Page title="Kody promocyjne" sub="Każdy kod działa jeden raz. Po udanej rezerwacji znika z listy aktywnych.">
      <div className="flex flex-wrap items-end gap-2 rounded-2xl bg-paper p-4 ring-1 ring-line">
        <div className="min-w-40 flex-1">
          <TextField label="Kod" value={code} onChange={setCode} placeholder="np. ZIMA15" />
        </div>
        <label className="block text-sm font-medium">
          Zniżka
          <select value={percent} onChange={(e) => setPercent(Number(e.target.value))} className="mt-1 block rounded-xl border border-line bg-paper px-3 py-2.5">
            {[5, 10, 15, 20, 25, 50, 100].map((p) => <option key={p} value={p}>{p === 100 ? "100% (bon)" : `${p}%`}</option>)}
          </select>
        </label>
        <button onClick={() => add(code, percent)} className="rounded-xl bg-ink px-4 py-2.5 font-semibold text-cream">Dodaj</button>
        <button
          onClick={() => add(`BON-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, 100)}
          className="rounded-xl px-4 py-2.5 font-semibold ring-1 ring-line"
        >
          Wygeneruj bon 100%
        </button>
      </div>

      <h2 className="mt-8 font-display text-2xl">Aktywne ({active.length})</h2>
      <div className="mt-3 divide-y divide-line rounded-2xl bg-paper ring-1 ring-line">
        {active.length === 0 && <p className="p-4 text-sm text-muted">Brak aktywnych kodów.</p>}
        {active.map((p) => (
          <div key={p.code} className="flex items-center justify-between p-4">
            <div>
              <div className="font-mono font-semibold">{p.code}</div>
              <div className="text-sm text-muted">{p.label}</div>
            </div>
            <button onClick={() => setAdmin({ promos: admin.promos.filter((x) => x.code !== p.code) })} className="text-sm text-muted hover:text-ember">Usuń</button>
          </div>
        ))}
      </div>

      {admin.usedPromos.length > 0 && (
        <>
          <h2 className="mt-8 font-display text-2xl">Wykorzystane</h2>
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {admin.usedPromos.map((u) => <li key={u.code + u.date}><span className="font-mono">{u.code}</span> — {fmtDateShort(u.date)}</li>)}
          </ul>
        </>
      )}
    </Page>
  );
}

function BlacklistView() {
  const { admin, setAdmin } = useDemo();
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  return (
    <Page title="Czarna lista" sub="Gość z tej listy nie dokończy rezerwacji online — zobaczy neutralną prośbę o kontakt telefoniczny. Sprawdzamy numer telefonu, a jeśli gość go poda — także e-mail.">
      <div className="grid gap-2 rounded-2xl bg-paper p-4 ring-1 ring-line sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <TextField label="Telefon lub e-mail" value={value} onChange={setValue} placeholder="+48 600 000 000" />
        <TextField label="Notatka (widzi tylko obsługa)" value={note} onChange={setNote} placeholder="np. zniszczenia 12.10" />
        <button
          disabled={!value.trim()}
          onClick={() => {
            setAdmin({ blacklist: [...admin.blacklist, { value: value.trim(), note: note.trim() }] });
            setValue("");
            setNote("");
          }}
          className="rounded-xl bg-ink px-4 py-2.5 font-semibold text-cream disabled:opacity-30"
        >
          Zablokuj
        </button>
      </div>
      <div className="mt-4 divide-y divide-line rounded-2xl bg-paper ring-1 ring-line">
        {admin.blacklist.length === 0 && <p className="p-4 text-sm text-muted">Lista jest pusta.</p>}
        {admin.blacklist.map((b) => (
          <div key={b.value} className="flex items-center justify-between gap-4 p-4">
            <div>
              <div className="font-semibold">{b.value}</div>
              {b.note && <div className="text-sm text-muted">{b.note}</div>}
            </div>
            <button onClick={() => setAdmin({ blacklist: admin.blacklist.filter((x) => x.value !== b.value) })} className="text-sm font-semibold text-moss hover:underline">Odblokuj</button>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">Gościa można też zablokować jednym kliknięciem z karty rezerwacji w kalendarzu.</p>
    </Page>
  );
}

function TemplatesView() {
  const { admin, setAdmin } = useDemo();
  const rows: { key: keyof AdminSettings["templates"]; label: string }[] = [
    { key: "confirm", label: "Potwierdzenie rezerwacji (SMS + e-mail)" },
    { key: "depositLink", label: "Link do zadatku — rezerwacja telefoniczna" },
    { key: "reminder", label: "Przypomnienie 24 h przed wizytą" },
  ];
  return (
    <Page title="Szablony SMS i e-mail" sub="Zmienne: {data}, {godziny}, {zadatek}, {mapa}, {link}. W pełnej wersji — w 3 językach (PL / RU / EN).">
      <div className="space-y-5">
        {rows.map((r) => (
          <label key={r.key} className="block text-sm font-medium">
            {r.label}
            <textarea
              rows={3}
              value={admin.templates[r.key]}
              onChange={(e) => setAdmin({ templates: { ...admin.templates, [r.key]: e.target.value } })}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2.5"
            />
          </label>
        ))}
      </div>
      <p className="mt-3 text-xs text-moss">✓ Szablon potwierdzenia widać na stronie „Dziękujemy” po rezerwacji (demo).</p>
    </Page>
  );
}

function ContentView() {
  const { admin, setAdmin } = useDemo();
  const [page, setPage] = useState<keyof AdminSettings["cms"]>("about");
  const names = { about: "O nas", careers: "Praca", rules: "Regulamin" } as const;
  return (
    <Page title="Treści strony" sub="Edycja tekstów stron bez programisty. W pełnej wersji: edytor z nagłówkami, zdjęciami i wersjami PL / RU / EN.">
      <div className="flex gap-1 rounded-xl bg-paper p-1 text-sm font-semibold ring-1 ring-line">
        {(Object.keys(names) as (keyof typeof names)[]).map((k) => (
          <button key={k} onClick={() => setPage(k)} className={`flex-1 rounded-lg py-2 ${page === k ? "bg-ink text-cream" : ""}`}>{names[k]}</button>
        ))}
      </div>
      <textarea
        rows={10}
        value={admin.cms[page]}
        onChange={(e) => setAdmin({ cms: { ...admin.cms, [page]: e.target.value } })}
        className="mt-4 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm"
      />
      <p className="mt-2 text-xs text-muted">W demo tekst zapisuje się w panelu; na stronie pojawi się po podłączeniu CMS w pełnej wersji.</p>
    </Page>
  );
}

function SettingsView() {
  const { admin, setAdmin } = useDemo();
  const bank = admin.bank;
  return (
    <Page title="Zadatek i płatności">
      <div className="max-w-xs">
        <NumField label="Kwota zadatku" value={admin.deposit} suffix="zł" onChange={(v) => setAdmin({ deposit: v ?? 0 })} />
      </div>
      <Saved />

      <h2 className="mt-10 font-display text-2xl">Dane do wypłat i faktur</h2>
      <p className="mt-1 text-sm text-muted">Na to konto bramka płatnicza (Stripe / Przelewy24) przelewa zadatki.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <TextField label="Właściciel konta" value={bank.owner} onChange={(v) => setAdmin({ bank: { ...bank, owner: v } })} placeholder="The Bania …" />
        <TextField label="NIP" value={bank.nip} onChange={(v) => setAdmin({ bank: { ...bank, nip: v } })} placeholder="000-000-00-00" />
        <TextField label="Numer konta (IBAN)" value={bank.iban} onChange={(v) => setAdmin({ bank: { ...bank, iban: v } })} placeholder="PL00 0000 0000 0000 0000 0000 0000" />
        <TextField label="Bank" value={bank.bank} onChange={(v) => setAdmin({ bank: { ...bank, bank: v } })} placeholder="np. mBank" />
      </div>

      <h2 className="mt-10 font-display text-2xl">PIN właściciela</h2>
      <p className="mt-1 text-sm text-muted">Menedżer widzi tylko kalendarz. Do ustawień, cen i kodów potrzebny jest ten PIN.</p>
      <div className="mt-3 max-w-xs">
        <TextField label="PIN" value={admin.pin} onChange={(v) => setAdmin({ pin: v.replace(/\D/g, "").slice(0, 6) })} />
      </div>
    </Page>
  );
}

function UsersView() {
  return (
    <Page title="Użytkownicy i role">
      <div className="divide-y divide-line rounded-2xl bg-paper ring-1 ring-line">
        <div className="p-4">
          <div className="font-semibold">Właściciel (superadministrator)</div>
          <p className="text-sm text-muted">Pełny dostęp: kalendarz, ceny, kody, czarna lista, szablony, treści, płatności, użytkownicy.</p>
        </div>
        <div className="p-4">
          <div className="font-semibold">Menedżer</div>
          <p className="text-sm text-muted">Tylko kalendarz: podgląd, rezerwacje ręczne, edycja, przeniesienie, anulowanie, blokady techniczne. Reszta zablokowana PIN-em.</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">W pełnej wersji: osobne loginy, hasła szyfrowane, panel pod niepublicznym adresem bez linków ze strony.</p>
    </Page>
  );
}

function ExportView({ from }: { from: string }) {
  const { bookingsFor } = useDemo();
  function download() {
    const rows = [["Data", "Od", "Do", "Godzin", "Gość", "Telefon", "Goście", "Źródło", "Status", "Dodatki"]];
    for (let i = 0; i < 31; i++) {
      const d = addDays(from, i);
      for (const b of bookingsFor(d)) rows.push([d, fmtHour(b.start), fmtHour(b.end), String(b.end - b.start), b.name, b.phone, String(b.guests), b.source, STATUS[statusOf(b)].label, b.extras.join(", ")]);
    }
    const csv = "﻿" + rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(";")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `bania-rezerwacje-${from}.csv`;
    a.click();
  }
  return (
    <Page title="Eksport do Excela" sub="Rezerwacje z wybranego okresu w formacie, który otworzysz w Excelu. Kolumny dopasujemy do Waszego obecnego pliku.">
      <button onClick={download} className="rounded-xl bg-ink px-5 py-3 font-semibold text-cream">Pobierz 31 dni od {fmtDateShort(from)}</button>
    </Page>
  );
}

function PinModal({ pin, onOk, onClose }: { pin: string; onOk: () => void; onClose: () => void }) {
  const [v, setV] = useState("");
  const [err, setErr] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          if (v === pin) onOk();
          else setErr(true);
        }}
        className="w-full max-w-xs rounded-[1.75rem] bg-paper p-6 text-center shadow-2xl"
      >
        <div className="text-3xl">🔒</div>
        <h2 className="mt-2 font-display text-2xl">PIN właściciela</h2>
        <p className="mt-1 text-xs text-muted">Demo: 1234</p>
        <input
          autoFocus
          inputMode="numeric"
          value={v}
          onChange={(e) => { setV(e.target.value); setErr(false); }}
          className="mt-4 w-full rounded-xl border border-line bg-cream px-3 py-3 text-center font-mono text-2xl tracking-[0.5em]"
        />
        {err && <p className="mt-2 text-sm text-ember">Nieprawidłowy PIN</p>}
        <button className="mt-4 w-full rounded-full bg-ink py-3 font-bold text-peach">Wejdź</button>
      </form>
    </div>
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
