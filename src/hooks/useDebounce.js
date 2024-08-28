import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

export default function useDebounce(callback, delay) {
  const debouncedFn = useCallback(
    debounce((...args) => callback(...args), delay),
    [callback, delay]
  );

  return debouncedFn;
}