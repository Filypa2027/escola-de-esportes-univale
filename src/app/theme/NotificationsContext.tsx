import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { mockNotifications, type NotificationPrefKey } from "../components/data/mockData";

export type NotificationPrefs = Record<NotificationPrefKey, boolean>;

const STORAGE_PREFS = "ees-notif-prefs";
const STORAGE_READ = "ees-notif-read";

const defaultPrefs: NotificationPrefs = {
  novasMatriculas: true,
  frequencia: true,
  acompanhamentos: false,
  relatorios: true,
};

type NotificationsContextValue = {
  prefs: NotificationPrefs;
  setPref: (key: NotificationPrefKey, value: boolean) => void;
  items: typeof mockNotifications;
  unreadCount: number;
  isRead: (id: number) => boolean;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<NotificationPrefs>(() => ({
    ...defaultPrefs,
    ...readJson<Partial<NotificationPrefs>>(STORAGE_PREFS, {}),
  }));
  const [readIds, setReadIds] = useState<number[]>(() => readJson<number[]>(STORAGE_READ, []));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFS, JSON.stringify(prefs));
      localStorage.setItem(STORAGE_READ, JSON.stringify(readIds));
    } catch {
      /* ignore */
    }
  }, [prefs, readIds]);

  const items = useMemo(
    () => mockNotifications.filter(n => prefs[n.type]),
    [prefs],
  );

  const unreadCount = items.filter(n => !readIds.includes(n.id)).length;

  const value = useMemo<NotificationsContextValue>(
    () => ({
      prefs,
      setPref: (key, value) => setPrefs(prev => ({ ...prev, [key]: value })),
      items,
      unreadCount,
      isRead: id => readIds.includes(id),
      markAsRead: id => setReadIds(prev => (prev.includes(id) ? prev : [...prev, id])),
      markAllAsRead: () => setReadIds(prev => [...new Set([...prev, ...items.map(n => n.id)])]),
    }),
    [prefs, items, unreadCount, readIds],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}
