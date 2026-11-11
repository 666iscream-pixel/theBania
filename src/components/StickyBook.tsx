"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CONFIG } from "@/lib/config";

// Telefon: mała pływająca pigułka w rogu, pojawia się dopiero po przewinięciu pierwszego ekranu.
// Desktop: przycisk jest w przyklejonym nagłówku.
export function StickyBook() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/rezerwacja") || pathname.startsWith("/admin")) return null;

  return (
    <div
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex items-center gap-2 transition duration-300 lg:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <a
        href={CONFIG.phoneHref}
        aria-label={`Zadzwoń: ${CONFIG.phone}`}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-paper text-ink shadow-lg ring-1 ring-line"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
          <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z" />
        </svg>
      </a>
      <Link href="/rezerwacja" className="flex h-12 items-center rounded-full bg-ember px-6 font-bold text-white shadow-lg shadow-ember/30">
        Zarezerwuj
      </Link>
    </div>
  );
}
