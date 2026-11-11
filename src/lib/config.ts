// Wszystkie reguły biznesowe w jednym miejscu — w pełnej wersji edytowalne w panelu administratora.
export const CONFIG = {
  openHour: 12,
  closeHour: 24,
  minHours: 2,
  bufferHours: 1, // sprzątanie / przygotowanie między rezerwacjami
  leadColdHours: 2.5, // tego dnia nie było rezerwacji: dojazd 0,5 h + rozpalenie 2 h
  leadWarmHours: 1.5, // tego dnia była już rezerwacja — piec rozgrzany
  highSeasonMonths: [9, 10, 11, 12, 1, 2, 3],
  keepEvening: { hours: 3, maxLoad: 0.3 },
  maxDaysAhead: 183,
  deposit: 200,
  holdMinutes: 5,
  baseGuests: 6,
  maxGuests: 12,
  extraGuestPerHour: 30,
  prices: {
    weekday: 200,
    weekend: 250,
    tubPerHour: 150,
    tubMinHours: 2,
    discountFromHour: 3,
    discount: 0.5,
  },
  phone: "+48 662 755 272",
  phoneHref: "tel:+48662755272",
  address: "Rakietowa 21, 54-615 Wrocław",
  instagram: "https://www.instagram.com/the_bania_/",
  facebook: "https://www.facebook.com/thebaniawro",
  googleMaps: "https://maps.app.goo.gl/w3BnjgbU5LdwLYu48",
};

export type Addon = {
  id: string;
  name: string;
  price: number | null; // null = wycena indywidualna
  unit: string;
  hint?: string;
  max?: number;
};

// Ceny z cennika na Instagramie (Oferta). Parmistrz — cena do ustalenia z właścicielem.
export const ADDONS: Addon[] = [
  { id: "witki-brzoza", name: "Witki brzozowe", price: 50, unit: "szt." },
  { id: "witki-dab", name: "Witki dębowe", price: 50, unit: "szt." },
  { id: "witki-eukaliptus", name: "Witki eukaliptusowe", price: 50, unit: "szt." },
  { id: "grill", name: "Rozpalenie grilla + węgiel", price: 40, unit: "usł.", hint: "Grill sam w sobie jest bezpłatny", max: 1 },
  { id: "parmistrz", name: "Ceremonia z parmistrzem", price: null, unit: "os.", hint: "Sesja dla 1 gościa · cena do ustalenia" },
];

export const INCLUDED = ["Czapeczki saunowe", "Rękawiczki dla witków", "Kapcie", "Herbata oraz kawa", "Miód", "Owoce", "Zimna beczka"];
export const BRING = ["Ręcznik", "Napoje", "Jedzenie", "Strój kąpielowy*"];

export type Promo = { code: string; percent: number; label: string };

export const PROMOS: Promo[] = [
  { code: "BANIA10", percent: 10, label: "−10% na całą rezerwację" },
  { code: "PREZENT-7KQ2", percent: 100, label: "Bon podarunkowy (jednorazowy)" },
];

// Czarna lista — gość nie zobaczy powodu, tylko neutralny komunikat.
export const BLACKLIST = { phones: ["500500500"], emails: ["zablokowany@example.com"] };

// Święta — liczone jak weekend.
export const HOLIDAYS = new Set([
  "2026-01-01", "2026-01-06", "2026-04-05", "2026-04-06", "2026-05-01", "2026-05-03",
  "2026-05-24", "2026-06-04", "2026-08-15", "2026-11-01", "2026-11-11", "2026-12-24",
  "2026-12-25", "2026-12-26", "2027-01-01", "2027-01-06", "2027-03-28", "2027-03-29",
  "2027-05-01", "2027-05-03", "2027-05-16", "2027-05-27", "2027-08-15",
]);
