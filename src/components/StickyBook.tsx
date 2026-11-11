"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONFIG } from "@/lib/config";

// Na telefonie przycisk rezerwacji zawsze pod kciukiem. Na desktopie jest w przyklejonym nagłówku.
export function StickyBook() {
  const pathname = usePathname();
  if (pathname.startsWith("/rezerwacja") || pathname.startsWith("/admin")) return null;
  return (
    <>
      <div className="h-20 lg:hidden" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line/70 bg-peach/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md gap-2">
          <Link href="/rezerwacja" className="flex-1 rounded-full bg-ember py-3.5 text-center font-bold text-white shadow-lg shadow-ember/25">
            Sprawdź wolne terminy
          </Link>
          <a href={CONFIG.phoneHref} aria-label={`Zadzwoń: ${CONFIG.phone}`} className="flex w-14 items-center justify-center rounded-full border-2 border-ink text-ink">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
              <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
