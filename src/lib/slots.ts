import { CONFIG } from "./config";
import { addDays, fromKey, isHighSeason, todayKey } from "./dates";
import type { Booking } from "./bookings";

export type SeasonMode = "auto" | "high" | "low";

export type SlotReason =
  | "busy" // zajęte lub koliduje ze sprzątaniem
  | "gap-before" // przed rezerwacją zostałby kawałek, którego nikt nie kupi
  | "gap-after" // po rezerwacji zostałby kawałek, którego nikt nie kupi
  | "evening" // wieczór trzymamy dla gości wieczornych
  | "lead" // za mało czasu na przygotowanie bani
  | "past";

export type Slot = { start: number; end: number; ok: boolean; reason?: SlotReason; detail?: string };

export type SlotOptions = {
  date: string;
  duration: number;
  bookings: Booking[];
  now: Date; // godzina „teraz” (w demo można ją zasymulować)
  season: SeasonMode;
  keepEvening: boolean;
};

const { openHour: OPEN, closeHour: CLOSE, minHours: MIN, bufferHours: BUF } = CONFIG;

export function highSeasonFor(date: string, season: SeasonMode) {
  return season === "auto" ? isHighSeason(date) : season === "high";
}

// Blok zajętości = rezerwacja + sprzątanie po niej (obcięte do zamknięcia).
function blocksOf(bookings: Booking[]) {
  return bookings
    .map((b) => ({ s: b.start, e: Math.min(b.end + BUF, CLOSE), len: b.end - b.start }))
    .sort((a, b) => a.s - b.s);
}

// Czy w wolny kawałek o długości `len` zmieści się jeszcze jeden gość.
// Przed kolejną rezerwacją: min. rezerwacja + sprzątanie. Na koniec dnia: próg z konfiguracji (TZ — 3 h).
function sellable(len: number, beforeBooking: boolean) {
  return len === 0 || len >= (beforeBooking ? MIN + BUF : CONFIG.minTailHours);
}

export function daySlots(o: SlotOptions): Slot[] {
  const blocks = blocksOf(o.bookings);
  const high = highSeasonFor(o.date, o.season);
  const isToday = o.date === todayKey(o.now);
  const nowH = o.now.getHours() + o.now.getMinutes() / 60;
  const load = blocks.reduce((a, b) => a + b.len, 0) / (CLOSE - OPEN);
  const eveningFrom = CLOSE - CONFIG.keepEvening.hours;

  const slots: Slot[] = [];
  for (let h = OPEN; h + o.duration <= CLOSE; h++) {
    const end = h + o.duration;
    const blockEnd = Math.min(end + BUF, CLOSE);
    const slot: Slot = { start: h, end, ok: true };

    if (blocks.some((b) => h < b.e && blockEnd > b.s)) {
      slots.push({ ...slot, ok: false, reason: "busy" });
      continue;
    }

    if (isToday) {
      const warm = blocks.some((b) => b.s < h);
      const lead = warm ? CONFIG.leadWarmHours : CONFIG.leadColdHours;
      if (h <= nowH) {
        slots.push({ ...slot, ok: false, reason: "past" });
        continue;
      }
      if (h - nowH < lead) {
        slots.push({
          ...slot,
          ok: false,
          reason: "lead",
          detail: warm
            ? `Bania jest już rozgrzana, ale potrzebujemy ${lead} h na przygotowanie.`
            : `Bania jest zimna — potrzebujemy ${lead} h na dojazd i rozpalenie pieca.`,
        });
        continue;
      }
    }

    if (high) {
      const prevEnd = Math.max(OPEN, ...blocks.filter((b) => b.e <= h).map((b) => b.e));
      const next = blocks.filter((b) => b.s >= blockEnd).map((b) => b.s);
      const nextStart = next.length ? Math.min(...next) : CLOSE;
      const before = h - prevEnd;
      const after = nextStart - blockEnd;
      if (!sellable(before, true)) {
        slots.push({ ...slot, ok: false, reason: "gap-before", detail: `Przed rezerwacją zostałoby ${before} h, których nikt już nie zarezerwuje.` });
        continue;
      }
      if (!sellable(after, nextStart < CLOSE)) {
        slots.push({ ...slot, ok: false, reason: "gap-after", detail: `Po rezerwacji i sprzątaniu zostałoby ${after} h, których nikt już nie zarezerwuje.` });
        continue;
      }
      if (o.keepEvening && load <= CONFIG.keepEvening.maxLoad && h < eveningFrom && blockEnd > eveningFrom) {
        slots.push({ ...slot, ok: false, reason: "evening", detail: `Dzień jest mało obłożony — ostatnie ${CONFIG.keepEvening.hours} h trzymamy dla gości wieczornych.` });
        continue;
      }
    }
    slots.push(slot);
  }

  // Jeśli reguła „wieczoru” zabrałaby wszystkie opcje — nie stosujemy jej.
  if (!slots.some((s) => s.ok) && slots.some((s) => s.reason === "evening")) {
    return slots.map((s) => (s.reason === "evening" ? { start: s.start, end: s.end, ok: true } : s));
  }
  return slots;
}

export function dayOpen(date: string, now: Date) {
  const diff = Math.round((fromKey(date).getTime() - fromKey(todayKey(now)).getTime()) / 86400000);
  return diff >= 0 && diff <= CONFIG.maxDaysAhead;
}

export type Alternatives = {
  shorter: { duration: number; starts: number[] }[];
  otherDays: { date: string; starts: number[] }[];
};

export function findAlternatives(o: SlotOptions, bookingsFor: (date: string) => Booking[]): Alternatives {
  const shorter: Alternatives["shorter"] = [];
  for (let d = o.duration - 1; d >= MIN && shorter.length < 2; d--) {
    const starts = daySlots({ ...o, duration: d }).filter((s) => s.ok).map((s) => s.start);
    if (starts.length) shorter.push({ duration: d, starts });
  }
  const otherDays: Alternatives["otherDays"] = [];
  for (let i = 1; i <= 21 && otherDays.length < 4; i++) {
    const date = addDays(o.date, i);
    if (!dayOpen(date, o.now)) break;
    const starts = daySlots({ ...o, date, bookings: bookingsFor(date) }).filter((s) => s.ok).map((s) => s.start);
    if (starts.length) otherDays.push({ date, starts });
  }
  return { shorter, otherDays };
}

export const REASON_LABEL: Record<SlotReason, string> = {
  busy: "Zajęte",
  "gap-before": "Zostawia martwe okno przed",
  "gap-after": "Zostawia martwe okno po",
  evening: "Wieczór zarezerwowany",
  lead: "Za mało czasu na rozpalenie",
  past: "Już minęło",
};
