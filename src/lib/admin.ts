import { ADDONS, BLACKLIST, CONFIG, HOLIDAYS, PROMOS, type Promo } from "./config";

// Ustawienia, które właściciel zmienia w panelu. W demo trzymane w przeglądarce, w pełnej wersji — w bazie.
export type AdminSettings = {
  deposit: number;
  weekday: number;
  weekend: number;
  tubPerHour: number;
  holidays: string[];
  addonPrices: Record<string, number | null>;
  promos: Promo[];
  usedPromos: { code: string; date: string }[];
  blacklist: { value: string; note: string }[];
  bank: { owner: string; iban: string; bank: string; nip: string };
  templates: { confirm: string; reminder: string; depositLink: string };
  cms: { about: string; careers: string; rules: string };
  pin: string;
};

export const ADMIN_DEFAULTS: AdminSettings = {
  deposit: CONFIG.deposit,
  weekday: CONFIG.prices.weekday,
  weekend: CONFIG.prices.weekend,
  tubPerHour: CONFIG.prices.tubPerHour,
  holidays: [...HOLIDAYS].sort(),
  addonPrices: Object.fromEntries(ADDONS.map((a) => [a.id, a.price])),
  promos: PROMOS,
  usedPromos: [],
  blacklist: [
    ...BLACKLIST.phones.map((v) => ({ value: v, note: "Zniszczenia, brak kontaktu" })),
    ...BLACKLIST.emails.map((v) => ({ value: v, note: "" })),
  ],
  bank: { owner: "", iban: "", bank: "", nip: "" },
  templates: {
    confirm: "The Bania: rezerwacja potwierdzona — {data}, {godziny}. Rakietowa 21, Wrocław. Dojazd: {mapa}. Zadatek {zadatek} zł otrzymany.",
    reminder: "The Bania: przypominamy o jutrzejszej wizycie — {data}, {godziny}. Do zobaczenia! Dojazd: {mapa}",
    depositLink: "The Bania: aby potwierdzić rezerwację {data}, {godziny}, wpłać zadatek {zadatek} zł: {link}. Masz 1 godzinę.",
  },
  cms: {
    about: "Prawdziwa bania opalana drewnem we Wrocławiu. Wynajmujecie cały obiekt: łaźnię, gorącą beczkę, strefę relaksu i ogród.",
    careers: "Szukamy parmistrza / parmistrzyni. Elastyczny grafik, przyuczymy.",
    rules: "Przed wejściem do bani weź ciepły prysznic bez mydła. …",
  },
  pin: "1234",
};

export function normalizePhone(v: string) {
  return v.replace(/\D/g, "").replace(/^48(?=\d{9}$)/, "");
}

// Czarna lista: dopasowanie po numerze telefonu (główne) lub e-mailu, jeśli gość go podał.
export function isBlacklisted(s: AdminSettings, phone: string, email: string) {
  const p = normalizePhone(phone);
  const e = email.trim().toLowerCase();
  return s.blacklist.some((b) => {
    const v = b.value.trim().toLowerCase();
    return (p && normalizePhone(v) === p) || (e && v === e);
  });
}

// Kod działa tylko raz — po użyciu znika z aktywnych.
export function activePromo(s: AdminSettings, code: string) {
  const c = code.trim().toLowerCase();
  if (!c || s.usedPromos.some((u) => u.code.toLowerCase() === c)) return null;
  return s.promos.find((p) => p.code.toLowerCase() === c) || null;
}
