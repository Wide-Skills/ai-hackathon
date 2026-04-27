"use client";

import { useCallback, useEffect, useState } from "react";

export function usePersistentState<T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(defaultValue);
  const [_isInitialized, setIsInitialized] = useState(false);

  // initialize state from localstorage
  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        setState(JSON.parse(storedValue));
      }
    } catch (error) {
      console.error(`Error reading persistent state for key "${key}":`, error);
    } finally {
      setIsInitialized(true);
    }
  }, [key]);

  // update localstorage when state changes
  const setPersistentState = useCallback(
    (value: T) => {
      try {
        setState(value);
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(
          `Error writing persistent state for key "${key}":`,
          error,
        );
      }
    },
    [key],
  );

  return [state, setPersistentState];
}
