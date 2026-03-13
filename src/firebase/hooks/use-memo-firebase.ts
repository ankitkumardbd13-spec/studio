'use client';

import { useMemo, DependencyList } from 'react';

/**
 * A wrapper around useMemo to stabilize Firebase references or queries.
 */
export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T {
  return useMemo(factory, deps);
}
