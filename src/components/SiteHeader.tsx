"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

const NAV = [
  { href: "/#o-nas", label: "O nas" },
  { href: "/cennik", label: "Cennik" },
  { href: "/rezerwacja", label: "Rezerwacja" },
  { href: "/galeria", label: "Galeria" },
  { href: "/regulamin", label: "Regulamin i FAQ" },
  { href: "/praca", label: "Praca" },
  { href: "/kontakt", label: "Kontakt" },
];

const LANGS = ["PL", "RU", "EN"];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("PL");
  const [toast, setToast] = useState(false);

  function pickLang(l: string) {
    setLang(l);
    if (l !== "PL") {
      setToast(true);
      setTimeout(() => setToast(false), 2600);
    }
  }

  const isActive = (href: string) => !href.startsWith("/#") && pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-peach/95 backdrop-blur">
      <div className="wrap flex items-center justify-between gap-4 py-1.5">
        <Link href="/" className="flex shrink-0 items-center" aria-label="The Bania — strona główna">
          <span className="sm:hidden"><Logo size={64} /></span>
          <span className="hidden sm:block"><Logo size={92} /></span>
        </Link>
        <nav className="hidden items-center gap-6 text-[15px] font-medium xl:gap-7 lg:flex" aria-label="Menu główne">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`relative py-1 transition after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded after:bg-ink after:transition ${
                isActive(n.href) ? "font-bold after:scale-x-100" : "opacity-80 after:scale-x-0 hover:opacity-100 hover:after:scale-x-100"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 text-xs font-semibold sm:flex" aria-label="Język">
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => pickLang(l)}
                aria-pressed={lang === l}
                className={`rounded px-1.5 py-1 transition ${lang === l ? "underline underline-offset-4" : "opacity-60 hover:opacity-100"}`}
              >
                {l}
              </button>
            ))}
          </div>
          <Link href="/rezerwacja" className="hidden rounded-full bg-ember px-5 py-3 text-sm font-bold text-white shadow-md shadow-ember/25 transition hover:-translate-y-0.5 hover:bg-[#c71f1a] lg:inline-block">
            Zarezerwuj termin
          </Link>
          <button className="-mr-1 p-1 lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Zamknij menu" : "Otwórz menu"} aria-expanded={open}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav className="wrap pb-3 lg:hidden" aria-label="Menu mobilne">
          <div className="flex flex-col gap-1 rounded-2xl bg-paper p-3 shadow-lg">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 hover:bg-peach ${isActive(n.href) ? "bg-peach font-bold" : ""}`}
              >
                {n.label}
              </Link>
            ))}
            <div className="flex gap-3 px-3 pt-2 text-sm font-semibold">
              {LANGS.map((l) => (
                <button key={l} onClick={() => pickLang(l)} className={lang === l ? "underline" : "opacity-60"}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}
      {toast && (
        <div role="status" className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm text-cream shadow-lg">
          Wersja {lang} — w pełnej wersji strony
        </div>
      )}
    </header>
  );
}
