import { ADDONS, CONFIG, type Promo } from "./config";
import { ADMIN_DEFAULTS, type AdminSettings } from "./admin";
import { isHoliday, isWeekendRate } from "./dates";

export type PriceInput = {
  date: string;
  hours: number;
  tubHours: number;
  guests: number;
  addons: Record<string, number>;
  promo?: Promo | null;
};

export type PriceLine = { label: string; detail?: string; amount: number };

export type PriceResult = {
  lines: PriceLine[];
  subtotal: number;
  discount: number;
  total: number; // płatne online / w rozliczeniu
  onSite: number; // dopłata za gości ponad 6 — liczona na miejscu
  deposit: number;
  rest: number;
  rate: number;
};

type PriceSettings = Pick<AdminSettings, "weekday" | "weekend" | "tubPerHour" | "deposit" | "holidays" | "addonPrices">;

// Godziny od 3. w górę −50%.
function hoursCost(rate: number, hours: number) {
  const { discountFromHour, discount } = CONFIG.prices;
  let sum = 0;
  for (let i = 1; i <= hours; i++) sum += i >= discountFromHour ? rate * (1 - discount) : rate;
  return sum;
}

export function rateFor(date: string, s: PriceSettings = ADMIN_DEFAULTS) {
  return isWeekendRate(date, s.holidays) ? s.weekend : s.weekday;
}

export function calcPrice(p: PriceInput, s: PriceSettings = ADMIN_DEFAULTS): PriceResult {
  const rate = rateFor(p.date, s);
  const lines: PriceLine[] = [];
  const full = Math.min(p.hours, CONFIG.prices.discountFromHour - 1);
  const half = p.hours - full;
  lines.push({
    label: `Bania, ${p.hours} h`,
    detail: `${full} × ${rate} zł${half ? ` + ${half} × ${rate * (1 - CONFIG.prices.discount)} zł (−50% od 3. godziny)` : ""}${isHoliday(p.date, s.holidays) ? " · święto" : ""}`,
    amount: hoursCost(rate, p.hours),
  });
  if (p.tubHours > 0) {
    lines.push({ label: `Gorąca beczka, ${p.tubHours} h`, detail: `od 3. godziny −50%`, amount: hoursCost(s.tubPerHour, p.tubHours) });
  }
  for (const a of ADDONS) {
    const q = p.addons[a.id] || 0;
    const price = a.id in s.addonPrices ? s.addonPrices[a.id] : a.price;
    if (q > 0) lines.push({ label: `${a.name} × ${q}`, detail: price === null ? "cena do ustalenia na miejscu" : undefined, amount: (price ?? 0) * q });
  }
  const subtotal = lines.reduce((a, l) => a + l.amount, 0);
  const discount = p.promo ? Math.round((subtotal * p.promo.percent) / 100) : 0;
  const total = subtotal - discount;
  const extraGuests = Math.max(0, p.guests - CONFIG.baseGuests);
  const onSite = extraGuests * CONFIG.extraGuestPerHour * p.hours;
  const deposit = Math.min(s.deposit, total);
  return { lines, subtotal, discount, total, onSite, deposit, rest: total - deposit, rate };
}

export const zl = (n: number) => `${n.toLocaleString("pl-PL")} zł`;
