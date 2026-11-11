"use client";

import Link from "next/link";
import { useMemo } from "react";
import { addDays, fmtDate, fmtHour, todayKey } from "@/lib/dates";
import { dayOpen, daySlots } from "@/lib/slots";
import { useDemo } from "@/lib/store";

const DURATION = 3;

// Najbliższy wolny termin (3 h) — konkretna godzina motywuje bardziej niż ogólne „zarezerwuj”.
export function NextSlot() {
  const { ready, now, bookingsFor, settings } = useDemo();

  const next = useMemo(() => {
    if (!ready) return null;
    const today = todayKey(now);
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      if (!dayOpen(date, now)) break;
      const slot = daySlots({ date, duration: DURATION, bookings: bookingsFor(date), now, season: settings.season, keepEvening: settings.keepEvening }).find((s) => s.ok);
      if (slot) return { date, slot, i };
    }
    return null;
  }, [ready, now, bookingsFor, settings.season, settings.keepEvening]);

  if (!next) return <p className="h-6" aria-hidden />;
  const day = next.i === 0 ? "dziś" : next.i === 1 ? "jutro" : fmtDate(next.date);

  return (
    <Link href={`/rezerwacja?d=${next.date}&h=${DURATION}`} className="group inline-flex items-center gap-2 text-sm">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-moss/50" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-moss" />
      </span>
      <span className="text-muted">
        Najbliższy wolny termin: <b className="text-ink group-hover:underline">{day}, {fmtHour(next.slot.start)}–{fmtHour(next.slot.end)}</b>
      </span>
    </Link>
  );
}
