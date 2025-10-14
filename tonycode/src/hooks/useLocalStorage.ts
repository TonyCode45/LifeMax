import { useEffect, useRef, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = (targetKey: string): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(targetKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${targetKey} from localStorage:`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(() => readValue(key));
  const previousKey = useRef(key);

  useEffect(() => {
    if (previousKey.current !== key) {
      const nextValue = readValue(key);
      previousKey.current = key;
      setStoredValue(nextValue);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue] as const;
}
