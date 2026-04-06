import { useSelector } from 'react-redux';

import {
  selectAnyLoadingByPrefix,
  selectLoadingByKey,
} from '@/core/store/loadingSlice';

/**
 * Check if a specific loading key is active.
 * Usage: const isLoading = useLoadingKey(LOADING_KEYS.DASHBOARD_GET_STATS);
 */
export function useLoadingKey(key) {
  return useSelector(selectLoadingByKey(key));
}

/**
 * Check if ANY loading key with a given prefix is active.
 * Usage: const isAnythingLoading = useAnyLoading("DASHBOARD");
 */
export function useAnyLoading(prefix) {
  return useSelector(selectAnyLoadingByPrefix(prefix));
}
