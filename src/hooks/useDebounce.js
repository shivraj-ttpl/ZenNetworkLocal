import { useState, useEffect } from "react";

/**
 * Returns a debounced version of the provided value.
 * The returned value only updates after the specified delay
 * has passed without the input value changing.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(search, 400);
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
