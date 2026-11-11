"use client";

import Link from "next/link";
import { useState } from "react";
import { Art } from "@/components/Art";

// W pełnej wersji wiadomość trafia na e-mail właściciela (Resend), z kopią w panelu.
export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2rem] bg-paper p-10 text-center ring-1 ring-line">
        <Art name="teapot" className="h-32" />
        <h2 className="mt-4 font-display text-3xl">Dziękujemy!</h2>
        <p className="mt-2 max-w-sm text-muted">Wiadomość dotarła. Odpowiemy na podany e-mail najszybciej, jak to możliwe.</p>
        <button onClick={() => setSent(false)} className="mt-6 font-bold underline underline-offset-4">Napisz kolejną wiadomość</button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="rounded-[2rem] bg-paper p-8 ring-1 ring-line sm:p-10"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Imię" name="name" autoComplete="name" />
        <Field label="E-mail" name="email" type="email" autoComplete="email" />
        <Field label="Telefon (opcjonalnie)" name="phone" type="tel" autoComplete="tel" required={false} />
        <label className="block text-sm font-semibold">
          Temat
          <select name="topic" className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-3">
            <option>Pytanie ogólne</option>
            <option>Bon podarunkowy</option>
            <option>Większa grupa / wydarzenie</option>
            <option>Rezerwacja</option>
          </select>
        </label>
        <label className="block text-sm font-semibold sm:col-span-2">
          Wiadomość
          <textarea name="message" required rows={5} className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-3" />
        </label>
      </div>
      <label className="mt-4 flex gap-3 text-sm text-muted">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0" />
        <span>Wyrażam zgodę na przetwarzanie danych w celu odpowiedzi na wiadomość. <Link href="/regulamin" className="underline">Polityka prywatności</Link>.</span>
      </label>
      <button className="mt-6 w-full rounded-full bg-ink py-3.5 font-bold text-peach transition hover:bg-wood-dark sm:w-auto sm:px-10">Wyślij wiadomość</button>
    </form>
  );
}

function Field({ label, required = true, ...rest }: { label: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input {...rest} required={required} className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-3" />
    </label>
  );
}
