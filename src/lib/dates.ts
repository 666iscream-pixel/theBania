import { CONFIG, HOLIDAYS } from "./config";

export const pad = (n: number) => String(n).padStart(2, "0");

export function toKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: string, days: number) {
  const d = fromKey(key);
  d.setDate(d.getDate() + days);
  return toKey(d);
}

export function todayKey(now = new Date()) {
  return toKey(now);
}

export function isWeekendRate(key: string) {
  const dow = fromKey(key).getDay(); // 0 nd, 5 pt, 6 sob
  return dow === 0 || dow === 5 || dow === 6 || HOLIDAYS.has(key);
}

export function isHoliday(key: string) {
  return HOLIDAYS.has(key);
}

export function isHighSeason(key: string) {
  return CONFIG.highSeasonMonths.includes(fromKey(key).getMonth() + 1);
}

export function fmtHour(h: number) {
  return `${pad(Math.floor(h) % 24)}:${pad(Math.round((h % 1) * 60))}`;
}

const MONTHS = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
const MONTHS_NOM = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
const DAYS = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];
export const DAYS_SHORT = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];

export function fmtDate(key: string) {
  const d = fromKey(key);
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function fmtDateShort(key: string) {
  const d = fromKey(key);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function monthName(year: number, month: number) {
  return `${MONTHS_NOM[month]} ${year}`;
}
