import { useState, useEffect } from 'react';

/**
 * Delays updating a value until after a specified delay.
 * Useful for reducing API calls on fast-changing inputs like search.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
