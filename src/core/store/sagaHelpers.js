import { call, put } from 'redux-saga/effects';

import { formatErrorMessage } from '@/utils/GeneralUtils';

import { setLoadingKey } from './loadingSlice';
import { addNotification, TOASTER_VARIANT } from './notificationSlice';

/**
 * Universal saga wrapper — handles loadingKey + error handling automatically.
 *
 * Usage in your saga:
 *   function* fetchStats(action) {
 *
 *     yield* apiCall({
 *       loadingKey: LOADING_KEYS.DASHBOARD_GET_STATS,
 *       apiFunc: () => {DashboardService.getStats(action.payload)},
 *       onSuccess: function* (response) {
 *         yield put(setStats(response.data));
 *       },
 *       // optional:
 *       onError: function* (error) { ... },
 *       showErrorToast: true, // default true
 *     });
 *   }
 */
export function* apiCall({
  loadingKey,
  apiFunc,
  onSuccess,
  onError,
  showErrorToast = true,
}) {
  // Start loading
  if (loadingKey) {
    yield put(setLoadingKey({ key: loadingKey, value: true }));
  }

  try {
    const response = yield call(apiFunc);

    if (onSuccess) {
      yield* onSuccess(response);
    }

    return response;
  } catch (error) {
    if (showErrorToast) {
      yield put(
        addNotification({
          message: formatErrorMessage(error),
          variant: TOASTER_VARIANT.ERROR,
        }),
      );
    }

    if (onError) {
      yield* onError(error);
    }

    return null;
  } finally {
    if (loadingKey) {
      yield put(setLoadingKey({ key: loadingKey, value: false }));
    }
  }
}

/**
 * Create a simple action creator object (non-redux-toolkit, for saga dispatch).
 * Same pattern as sozen: dispatch(actionCreators.fetchDashboard(payload))
 *
 * Usage:
 *   export const dashboardActions = createSagaActions("DASHBOARD", [
 *     "fetchStats",
 *     "fetchChart",
 *   ]);
 *   // dashboardActions.fetchStats(payload) => { type: "DASHBOARD/FETCH_STATS", payload }
 */
export function createSagaActions(prefix, actionNames) {
  const actions = {};
  for (const name of actionNames) {
    const type = `${prefix}/${name.replace(/([A-Z])/g, '_$1').toUpperCase()}`;
    actions[name] = (payload) => ({ type, payload });
  }
  return actions;
}
