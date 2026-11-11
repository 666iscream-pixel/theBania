import { addDays, fromKey, isHighSeason, todayKey } from "./dates";

export type BookingStatus = "paid" | "pending" | "blocked";

export type Booking = {
  id: string;
  date: string;
  start: number;
  end: number;
  status: BookingStatus;
  source: "www" | "phone";
  name: string;
  phone: string;
  guests: number;
  tubHours: number;
  extras: string[];
  total: number;
};

const NAMES = [
  "Anna Kowalska", "Piotr Nowak", "Kasia Wiśniewska", "Michał Zieliński", "Ola Lewandowska",
  "Tomasz Wójcik", "Marta Kamińska", "Paweł Dąbrowski", "Julia Szymańska", "Kuba Woźniak",
  "Iryna Bondarenko", "Dmitrij Sokołow", "Natalia Mazur", "Bartek Krawczyk",
];

// Typowe układy dnia (start, koniec) — wyglądają jak prawdziwy grafik.
const PATTERNS: [number, number][][] = [
  [[12, 15], [16, 19], [20, 23]],
  [[13, 16], [17, 20], [21, 24]],
  [[15, 18], [19, 22]],
  [[16, 20], [21, 24]],
  [[12, 14], [18, 21]],
  [[14, 17], [18, 21], [22, 24]],
  [[17, 20], [21, 24]],
  [[12, 16], [19, 23]],
];

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function seedOf(key: string) {
  return key.split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
}

const cache = new Map<string, Booking[]>();

// Dane demonstracyjne: im bliżej termin i im bardziej weekend/sezon, tym większe obłożenie.
export function mockBookingsFor(key: string, today = todayKey()): Booking[] {
  const cacheKey = `${key}|${today}`;
  const hit = cache.get(cacheKey);
  if (hit) return hit;
  const r = rand(seedOf(key));
  const daysAhead = Math.round((fromKey(key).getTime() - fromKey(today).getTime()) / 86400000);
  const dow = fromKey(key).getDay();
  const weekend = dow === 0 || dow === 5 || dow === 6;
  let fill = isHighSeason(key) ? 0.5 : 0.3;
  if (weekend) fill += 0.15;
  if (daysAhead > 14) fill -= 0.3;
  if (daysAhead > 45) fill -= 0.3;
  const pattern = PATTERNS[Math.floor(r() * PATTERNS.length)];
  const out: Booking[] = [];
  pattern.forEach(([s, e], i) => {
    if (r() > fill) return;
    const name = NAMES[Math.floor(r() * NAMES.length)];
    const guests = 2 + Math.floor(r() * 8);
    const blocked = r() < 0.04;
    const phoneSource = r() < 0.45;
    out.push({
      id: `${key}-${i}`,
      date: key,
      start: s,
      end: e,
      status: blocked ? "blocked" : phoneSource && daysAhead >= 0 && daysAhead < 4 && r() < 0.5 ? "pending" : "paid",
      source: phoneSource ? "phone" : "www",
      name: blocked ? "Blokada terminu" : name,
      phone: blocked ? "" : `+48 ${600 + Math.floor(r() * 99)} ${100 + Math.floor(r() * 899)} ${100 + Math.floor(r() * 899)}`,
      guests,
      tubHours: r() < 0.5 ? 2 : 0,
      extras: r() < 0.5 ? ["Witki dębowe"] : [],
      total: 0,
    });
  });
  // Dane demo mają wyglądać jak prawdziwe po działaniu reguł: sam wieczór przy pustym dniu nie powstałby online.
  const fixed = out.length === 1 && out[0].end > 21 ? [] : out;
  cache.set(cacheKey, fixed);
  return fixed;
}

export function rangeKeys(from: string, days: number) {
  return Array.from({ length: days }, (_, i) => addDays(from, i));
}
