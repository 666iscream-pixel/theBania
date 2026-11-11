import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DemoPanel } from "@/components/DemoPanel";
import { BookingFlow } from "./BookingFlow";

export const metadata = { title: "Rezerwacja online — The Bania Wrocław" };

export default function Rezerwacja() {
  return (
    <>
      <SiteHeader />
      <main className="wrap pb-24 pt-10">
        <BookingFlow />
      </main>
      <SiteFooter />
      <DemoPanel />
    </>
  );
}
