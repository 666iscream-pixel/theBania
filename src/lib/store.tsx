"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { mockBookingsFor, type Booking } from "./bookings";
import type { SeasonMode } from "./slots";
import { ADMIN_DEFAULTS, type AdminSettings } from "./admin";

export type DemoSettings = {
  season: SeasonMode;
  keepEvening: boolean;
  simHour: number | null; // symulowana godzina „teraz”
  showHidden: boolean; // pokaż ukryte godziny z powodem
};

const DEFAULTS: DemoSettings = { season: "auto", keepEvening: true, simHour: null, showHidden: false };

type Store = {
  ready: boolean;
  settings: DemoSettings;
  setSettings: (s: Partial<DemoSettings>) => void;
  now: Date;
  bookingsFor: (date: string) => Booking[];
  addBooking: (b: Booking) => void;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  removeBooking: (id: string) => void;
  admin: AdminSettings;
  setAdmin: (patch: Partial<AdminSettings>) => void;
  reset: () => void;
};

const Ctx = createContext<Store | null>(null);
const KEY = "bania-demo-v1";

type Persisted = { settings: DemoSettings; added: Booking[]; patched: Record<string, Partial<Booking>>; removed: string[]; admin?: Partial<AdminSettings> };

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [settings, setS] = useState<DemoSettings>(DEFAULTS);
  const [added, setAdded] = useState<Booking[]>([]);
  const [patched, setPatched] = useState<Record<string, Partial<Booking>>>({});
  const [removed, setRemoved] = useState<string[]>([]);
  const [admin, setAdminState] = useState<AdminSettings>(ADMIN_DEFAULTS);
  const [loaded, setLoaded] = useState(false);
  const [tick, setTick] = useState(0); // 0 = jeszcze przed hydratacją

  // Odczyt z localStorage dopiero po hydratacji, żeby serwer i klient renderowały to samo.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw) as Persisted;
        setS({ ...DEFAULTS, ...p.settings });
        setAdded(p.added || []);
        setPatched(p.patched || {});
        setRemoved(p.removed || []);
        setAdminState({ ...ADMIN_DEFAULTS, ...p.admin });
      }
    } catch {}
    setLoaded(true);
    setTick(Date.now());
    const t = setInterval(() => setTick(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ settings, added, patched, removed, admin } satisfies Persisted));
    } catch {}
  }, [settings, added, patched, removed, admin, loaded]);

  const now = useMemo(() => {
    const d = new Date(tick);
    if (settings.simHour !== null) d.setHours(Math.floor(settings.simHour), Math.round((settings.simHour % 1) * 60), 0, 0);
    return d;
  }, [tick, settings.simHour]);

  const bookingsFor = useCallback(
    (date: string) =>
      [...mockBookingsFor(date), ...added.filter((b) => b.date === date)]
        .filter((b) => !removed.includes(b.id))
        .map((b) => (patched[b.id] ? { ...b, ...patched[b.id] } : b)),
    [added, patched, removed],
  );

  const value: Store = {
    ready: loaded && tick > 0,
    settings,
    setSettings: (s) => setS((prev) => ({ ...prev, ...s })),
    now,
    bookingsFor,
    addBooking: (b) => setAdded((prev) => [...prev, b]),
    updateBooking: (id, patch) => {
      if (added.some((b) => b.id === id)) setAdded((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
      else setPatched((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
    },
    removeBooking: (id) => {
      setAdded((prev) => prev.filter((b) => b.id !== id));
      setRemoved((prev) => [...prev, id]);
    },
    admin,
    setAdmin: (patch) => setAdminState((prev) => ({ ...prev, ...patch })),
    reset: () => {
      setS(DEFAULTS);
      setAdminState(ADMIN_DEFAULTS);
      setAdded([]);
      setPatched({});
      setRemoved([]);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useDemo poza DemoProvider");
  return c;
}
