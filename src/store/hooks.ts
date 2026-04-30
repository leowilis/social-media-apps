import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';

/**
 * Typed version of `useDispatch`.
 * Use this instead of plain `useDispatch` to get full AppDispatch typing,
 * including support for thunks.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed version of `useSelector`.
 * Enforces RootState typing and infers the selected return type automatically.
 */
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector<RootState, T>(selector);
