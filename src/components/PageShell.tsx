import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { Art, type ArtName } from "./Art";

// Nagłówek strony w stylu postów: rycina + gruby tytuł z kropką.
export function PageShell({ art, eyebrow, title, intro, children }: { art?: ArtName; eyebrow?: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="w-full">
        <div className="bg-peach">
          <div className="wrap flex items-center gap-6 py-10 sm:gap-10 sm:py-12">
            {art && <Art name={art} className="h-28 w-auto shrink-0 sm:h-40" />}
            <div>
              {eyebrow && <p className="font-hand text-3xl text-moss">{eyebrow}</p>}
              <h1 className="font-display text-5xl leading-none sm:text-6xl">{title}</h1>
              {intro && <p className="mt-4 max-w-2xl text-lg text-muted">{intro}</p>}
            </div>
          </div>
        </div>
        <div className="wrap pb-24 pt-12">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
