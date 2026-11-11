"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CONFIG } from "@/lib/config";
import { addDays, todayKey } from "@/lib/dates";
import { useDemo } from "@/lib/store";

const HOURS = [2, 3, 4, 5, 6, 8];

// Mini-formularz na pierwszym ekranie: dzień + liczba godzin → od razu lista wolnych godzin w rezerwacji.
export function HeroBooking() {
  const router = useRouter();
  const { ready, now } = useDemo();
  const today = ready ? todayKey(now) : "";
  const [date, setDate] = useState("");
  const [hours, setHours] = useState(3);

  function go(e: React.FormEvent) {
    e.preventDefault();
    const d = date || today;
    router.push(d ? `/rezerwacja?d=${d}&h=${hours}` : `/rezerwacja?h=${hours}`);
  }

  return (
    <form onSubmit={go} className="flex flex-col gap-2 rounded-[1.75rem] bg-paper p-2 shadow-xl shadow-ink/5 ring-1 ring-line sm:flex-row sm:items-stretch">
      <label className="flex flex-1 flex-col rounded-2xl px-4 py-2 transition hover:bg-cream">
        <span className="text-xs font-bold uppercase tracking-wide text-muted">Kiedy?</span>
        <input
          type="date"
          value={date || today}
          min={today || undefined}
          max={today ? addDays(today, CONFIG.maxDaysAhead) : undefined}
          onChange={(e) => setDate(e.target.value)}
          className="bg-transparent font-semibold outline-none"
          aria-label="Data wizyty"
        />
      </label>
      <label className="flex flex-col rounded-2xl px-4 py-2 transition hover:bg-cream sm:w-36 sm:border-l sm:border-line">
        <span className="text-xs font-bold uppercase tracking-wide text-muted">Ile godzin?</span>
        <select value={hours} onChange={(e) => setHours(Number(e.target.value))} className="bg-transparent font-semibold outline-none" aria-label="Liczba godzin">
          {HOURS.map((h) => (
            <option key={h} value={h}>{h} {h < 5 ? "godziny" : "godzin"}</option>
          ))}
        </select>
      </label>
      <button className="rounded-2xl bg-ember px-6 py-3.5 font-bold text-white shadow-lg shadow-ember/25 transition hover:bg-[#c71f1a]">
        Sprawdź wolne godziny →
      </button>
    </form>
  );
}
