import { DemoPanel } from "@/components/DemoPanel";
import { AdminApp } from "./AdminApp";

export const metadata = { title: "Panel — The Bania", robots: { index: false } };

export default function Admin() {
  return (
    <>
      <AdminApp />
      <DemoPanel />
    </>
  );
}
