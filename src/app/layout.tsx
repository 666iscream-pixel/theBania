import type { Metadata } from "next";
import { Caveat, Open_Sans } from "next/font/google";
import { DemoProvider } from "@/lib/store";
import "./globals.css";
import { asset } from "@/lib/asset";

const open = Open_Sans({
  variable: "--font-open",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "The Bania Wrocław — bania opalana drewnem, wynajem na wyłączność",
  description:
    "Prawdziwa bania opalana drewnem we Wrocławiu. Wynajem na wyłączność do 12 osób, gorąca beczka z hydromasażem, witki i ceremonie z parmistrzem. Rezerwacja online.",
  icons: { icon: asset("/logo-peach.jpg") },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${open.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
