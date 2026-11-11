import { CONFIG } from "@/lib/config";
import type { Booking } from "@/lib/bookings";

const OPEN = CONFIG.openHour;
const SPAN = CONFIG.closeHour - CONFIG.openHour;
const pct = (h: number) => `${((h - OPEN) / SPAN) * 100}%`;

// Pasek dnia 12:00–00:00: zajęte, sprzątanie, wybrany termin.
export function DayTimeline({ bookings, selected }: { bookings: Booking[]; selected?: { start: number; end: number } | null }) {
  return (
    <div>
      <div className="relative h-11 overflow-hidden rounded-xl bg-paper ring-1 ring-line">
        {bookings.map((b) => (
          <div key={b.id}>
            <div
              className="absolute inset-y-0 flex items-center justify-center bg-wood/80 text-[11px] font-semibold text-cream"
              style={{ left: pct(b.start), width: `${((b.end - b.start) / SPAN) * 100}%` }}
            >
              Zajęte
            </div>
            {b.end < CONFIG.closeHour && (
              <div className="hatch absolute inset-y-0" style={{ left: pct(b.end), width: `${(Math.min(CONFIG.bufferHours, CONFIG.closeHour - b.end) / SPAN) * 100}%` }} />
            )}
          </div>
        ))}
        {selected && (
          <>
            <div
              className="absolute inset-y-1 flex items-center justify-center rounded-lg bg-ember text-[11px] font-semibold text-cream shadow ring-2 ring-ember/30"
              style={{ left: pct(selected.start), width: `${((selected.end - selected.start) / SPAN) * 100}%` }}
            >
              Twoja rezerwacja
            </div>
            {selected.end < CONFIG.closeHour && (
              <div className="hatch absolute inset-y-0 opacity-70" style={{ left: pct(selected.end), width: `${(CONFIG.bufferHours / SPAN) * 100}%` }} />
            )}
          </>
        )}
      </div>
      <div className="relative mt-1 h-4 text-[10px] text-muted">
        {Array.from({ length: SPAN + 1 }, (_, i) => OPEN + i).map((h) => (
          <span key={h} className="absolute -translate-x-1/2" style={{ left: pct(h) }}>
            {h % 2 === 0 ? `${h % 24}:00` : ""}
          </span>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-wood/80" />Zajęte</span>
        <span className="flex items-center gap-1.5"><span className="hatch h-3 w-3 rounded ring-1 ring-line" />Sprzątanie 1 h</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-ember" />Wybrany termin</span>
      </div>
    </div>
  );
}
