import { all, put, select, takeLatest } from 'redux-saga/effects';

import { LOADING_KEYS } from '@/constants/loadingKeys';
import { apiCall, createSagaActions } from '@/core/store/sagaHelpers';
import store from '@/core/store/store';
import MasterDataService from '@/services/appDataService/MasterDataService';

import {
  componentKey,
  setConditionsList,
  setTotalRecords,
  setTotalPages,
} from './conditionsSlice';

export const conditionsActions = createSagaActions(componentKey, [
  'fetchConditions',
]);

function* fetchConditionsSaga() {
  const state = yield select((s) => s[componentKey]);
  const { page, limit, search, showArchived } = state;

  const params = { page, limit };
  if (search) params.search = search;
  if (showArchived) params.showArchived = showArchived;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CONDITIONS_GET_LIST,
    apiFunc: () => MasterDataService.getConditions(params),
    onSuccess: function* (response) {
      const { data, meta } = response.data.data;
      yield put(setConditionsList(data));
      yield put(setTotalRecords(meta.total));
      yield put(setTotalPages(meta.totalPages));
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(conditionsActions.fetchConditions().type, fetchConditionsSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
