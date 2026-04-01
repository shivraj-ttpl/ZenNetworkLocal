import { all, put, takeLatest } from 'redux-saga/effects';

import { LOADING_KEYS } from '@/constants/loadingKeys';
import { apiCall, createSagaActions } from '@/core/store/sagaHelpers';
import store from '@/core/store/store';
import SettingsLabelsDataService from '@/services/appDataService/SettingsLabelsDataService';

import { componentKey, setLabelsList } from './subOrgLabelsSlice';

export const subOrgLabelsActions = createSagaActions(componentKey, [
  'fetchLabels',
]);

function* fetchLabelsSaga(action) {
  const { subOrgId } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.SUB_ORG_LABELS_GET,
    apiFunc: () => SettingsLabelsDataService.getLabelsBySubOrg(subOrgId),
    onSuccess: function* (response) {
      yield put(setLabelsList(response.data.data));
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(subOrgLabelsActions.fetchLabels().type, fetchLabelsSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
