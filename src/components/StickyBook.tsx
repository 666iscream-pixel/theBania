"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 transition duration-300 lg:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <Link href="/rezerwacja" className="flex h-12 items-center rounded-full bg-ember px-6 font-bold text-white shadow-lg shadow-ember/30">
        Zarezerwuj
      </Link>
    </div>
  );
}
