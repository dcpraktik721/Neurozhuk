// ========================================
// Поймай Жука — useLocalStorageBoolean
// ========================================
// Reads a boolean preference from localStorage with a stable
// SSR-safe hook. Uses useSyncExternalStore so we never call
// setState inside an effect (avoids react-hooks/set-state-in-effect).

'use client';

import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_EVENT = 'storage';

function readValue(key: string, defaultValue: boolean): boolean {
  if (typeof window === 'undefined') return defaultValue;
  const raw = window.localStorage.getItem(key);
  if (raw === null) return defaultValue;
  return raw === '1' || raw === 'true';
}

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(STORAGE_EVENT, callback);
  return () => window.removeEventListener(STORAGE_EVENT, callback);
}

export function useLocalStorageBoolean(
  key: string,
  defaultValue: boolean,
): [boolean, (next: boolean | ((prev: boolean) => boolean)) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => readValue(key, defaultValue),
    () => defaultValue,
  );

  const setValue = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      if (typeof window === 'undefined') return;
      const prev = readValue(key, defaultValue);
      const resolved = typeof next === 'function' ? next(prev) : next;
      window.localStorage.setItem(key, resolved ? '1' : '0');
      // Notify same-tab subscribers — `storage` events only fire
      // for OTHER tabs by spec, so we synthesise one here.
      window.dispatchEvent(new Event(STORAGE_EVENT));
    },
    [key, defaultValue],
  );

  return [value, setValue];
}
