import { all, put, takeLatest } from 'redux-saga/effects';

import { LOADING_KEYS } from '@/constants/loadingKeys';
import { toastMessages } from '@/constants/toastMessages';
import {
  addNotification,
  TOASTER_VARIANT,
} from '@/core/store/notificationSlice';
import { apiCall, createSagaActions } from '@/core/store/sagaHelpers';
import store from '@/core/store/store';
import SettingsLabelsDataService from '@/services/appDataService/SettingsLabelsDataService';

import {
  componentKey,
  setLabelsList,
  setRefreshLabels,
  setDefaultLabels,
} from './settingsLabelsSlice';

export const settingsLabelsActions = createSagaActions(componentKey, [
  'fetchLabels',
  'fetchDefaultLabels',
  'updateLabels',
]);

function* fetchLabelsSaga(action) {
  const { subOrgId } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_LABELS_GET,
    apiFunc: () => SettingsLabelsDataService.getLabels({ subOrgId }),
    onSuccess: function* (response) {
      yield put(setLabelsList(response.data.data));
    },
  });
}

function* fetchDefaultLabelsSaga() {
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_LABELS_GET_DEFAULTS,
    apiFunc: () => SettingsLabelsDataService.getDefaultLabels(),
    onSuccess: function* (response) {
      yield put(setDefaultLabels(response.data.data));
    },
  });
}

function* updateLabelsSaga(action) {
  const { subOrgId, labels } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_LABELS_PATCH_UPDATE,
    apiFunc: () =>
      SettingsLabelsDataService.updateLabels({ subOrgId, labels }),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.labelsUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshLabels());
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(settingsLabelsActions.fetchLabels().type, fetchLabelsSaga),
    takeLatest(settingsLabelsActions.fetchDefaultLabels().type, fetchDefaultLabelsSaga),
    takeLatest(settingsLabelsActions.updateLabels().type, updateLabelsSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
