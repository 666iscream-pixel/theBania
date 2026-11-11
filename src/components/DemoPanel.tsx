"use client";

import { useState } from "react";
import { useDemo } from "@/lib/store";

// Panel tylko na potrzeby prezentacji — pozwala pokazać, jak działają reguły.
export function DemoPanel() {
  const { settings, setSettings, reset } = useDemo();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40 text-sm">
      {open && (
        <div className="mb-3 w-80 rounded-2xl bg-ink p-5 text-cream shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-semibold">Tryb prezentacji</div>
            <button onClick={() => setOpen(false)} className="text-cream/60 hover:text-cream" aria-label="Zamknij">✕</button>
          </div>

          <label className="block text-xs uppercase tracking-wider text-cream/60">Sezon</label>
          <div className="mt-1 grid grid-cols-3 gap-1">
            {([
              ["auto", "Auto"],
              ["high", "Wysoki"],
              ["low", "Niski"],
            ] as const).map(([v, l]) => (
              <button
                key={v}
                onClick={() => setSettings({ season: v })}
                className={`rounded-lg py-1.5 ${settings.season === v ? "bg-peach text-ink" : "bg-cream/10 hover:bg-cream/20"}`}
              >
                {l}
              </button>
            ))}
          </div>

          <Toggle
            label="Trzymaj wieczór wolny"
            hint="Przy obłożeniu dnia ≤30% ostatnie 3 h zostają dla gości wieczornych"
            value={settings.keepEvening}
            onChange={(v) => setSettings({ keepEvening: v })}
          />
          <Toggle
            label="Pokaż ukryte godziny"
            hint="Gość ich nie widzi — tu widać, dlaczego zostały ukryte"
            value={settings.showHidden}
            onChange={(v) => setSettings({ showHidden: v })}
          />

          <label className="mt-4 block text-xs uppercase tracking-wider text-cream/60">Godzina „teraz” (rezerwacja na dziś)</label>
          <select
            value={settings.simHour ?? ""}
            onChange={(e) => setSettings({ simHour: e.target.value === "" ? null : Number(e.target.value) })}
            className="mt-1 w-full rounded-lg bg-cream/10 px-2 py-1.5"
          >
            <option value="" className="text-ink">Prawdziwa godzina</option>
            {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((h) => (
              <option key={h} value={h} className="text-ink">{h}:00</option>
            ))}
          </select>

          <button onClick={reset} className="mt-5 w-full rounded-lg border border-cream/20 py-1.5 text-cream/80 hover:bg-cream/10">
            Wyczyść dane demo
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="ml-auto flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 font-semibold text-cream shadow-xl"
      >
        <span className="h-2 w-2 rounded-full bg-green-400" /> Demo
      </button>
    </div>
  );
}

function Toggle({ label, hint, value, onChange }: { label: string; hint: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="mt-4 flex w-full items-start gap-3 text-left">
      <span className={`mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition ${value ? "bg-green-500" : "bg-cream/20"}`}>
        <span className={`h-4 w-4 rounded-full bg-white transition ${value ? "translate-x-4" : ""}`} />
      </span>
      <span>
        <span className="block">{label}</span>
        <span className="block text-xs text-cream/55">{hint}</span>
      </span>
    </button>
  );
}
