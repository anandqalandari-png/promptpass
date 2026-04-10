'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'promptpass_unlocked';

export function useUnlocked() {
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUnlocked(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, []);

  const unlock = useCallback((id: string) => {
    setUnlocked((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isUnlocked = useCallback(
    (id: string) => unlocked.includes(id),
    [unlocked]
  );

  return { unlocked, isUnlocked, unlock, hydrated };
}
