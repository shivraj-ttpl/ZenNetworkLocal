import { all, put, takeLatest } from 'redux-saga/effects';

import { LOADING_KEYS } from '@/constants/loadingKeys';
import { apiCall, createSagaActions } from '@/core/store/sagaHelpers';
import store from '@/core/store/store';
import SettingsProfileDataService from '@/services/appDataService/SettingsProfileDataService';

import { componentKey, setAuditLogs } from './settingsAuditLogSlice';

export const settingsAuditLogActions = createSagaActions(componentKey, [
  'fetchAuditLogs',
]);

function* fetchAuditLogsSaga(action) {
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_AUDIT_LOGS_GET_LIST,
    apiFunc: () => SettingsProfileDataService.getAuditLogs(action.payload),
    onSuccess: function* (response) {
      yield put(setAuditLogs(response?.data?.data));
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(
      settingsAuditLogActions.fetchAuditLogs().type,
      fetchAuditLogsSaga,
    ),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
