import { useState, useEffect } from 'react';

/**
 * Returns a debounced version of `value` that only updates after `delay` ms
 * of no changes.
 *
 * @param {*} value
 * @param {number} delay - milliseconds
 * @returns {*} debounced value
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
