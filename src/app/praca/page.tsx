"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";

export default function Praca() {
  const [sent, setSent] = useState(false);
  return (
    <PageShell art="lady" eyebrow="Praca" title="Dołącz do zespołu." intro="Szukamy ludzi, którzy kochają banię tak jak my. Zobacz aktualne oferty i napisz do nas.">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <article className="rounded-[2rem] bg-paper p-8 ring-1 ring-line">
          <div className="text-sm font-semibold text-wood">Wrocław · elastyczny grafik</div>
          <h2 className="mt-2 font-display text-3xl font-semibold">Parmistrz / parmistrzyni</h2>
          <p className="mt-4 text-muted">Szukamy osoby, która prowadzi ceremonie w bani: praca z witkami, parą i ziołami. Doświadczenie mile widziane — chętnie też przyuczymy.</p>
          <ul className="mt-6 space-y-2 text-sm">
            {["Prowadzenie ceremonii parowych", "Przygotowanie bani przed wizytą gości", "Dbanie o atmosferę i bezpieczeństwo"].map((x) => (
              <li key={x} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />{x}</li>
            ))}
          </ul>
        </article>
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="rounded-[2rem] bg-peach p-8"
        >
          <h2 className="font-display text-3xl font-semibold">Aplikuj</h2>
          {sent ? (
            <p className="mt-6 rounded-2xl bg-paper p-5">Dziękujemy! Zgłoszenie trafiło do skrzynki właściciela (demo).</p>
          ) : (
            <div className="mt-6 space-y-4">
              <Field label="Imię i nazwisko" />
              <Field label="Telefon lub e-mail" />
              <Field label="Języki" placeholder="np. polski, rosyjski, angielski" />
              <label className="block text-sm font-medium">
                O sobie
                <textarea required rows={4} className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2" />
              </label>
              <label className="flex gap-2 text-xs text-muted">
                <input type="checkbox" required className="mt-0.5" />
                Wyrażam zgodę na przetwarzanie moich danych w celu rekrutacji.
              </label>
              <button className="w-full rounded-full bg-ink py-3 font-semibold text-cream">Wyślij zgłoszenie</button>
            </div>
          )}
        </form>
      </div>
    </PageShell>
  );
}

function Field({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input required placeholder={placeholder} className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2" />
    </label>
  );
}
