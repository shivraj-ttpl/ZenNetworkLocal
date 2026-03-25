import { all, put, select, takeLatest } from 'redux-saga/effects';

import { LOADING_KEYS } from '@/constants/loadingKeys';
import { apiCall, createSagaActions } from '@/core/store/sagaHelpers';
import store from '@/core/store/store';
import MasterDataService from '@/services/appDataService/MasterDataService';

import {
  componentKey,
  setAssessmentsList,
  setTotalRecords,
  setTotalPages,
} from './assessmentsSlice';

export const assessmentsActions = createSagaActions(componentKey, [
  'fetchAssessments',
]);

function* fetchAssessmentsSaga() {
  const state = yield select((s) => s[componentKey]);
  const { page, limit, search, showArchived } = state;

  const params = { page, limit };
  if (search) params.search = search;
  if (showArchived) params.showArchived = showArchived;

  yield* apiCall({
    loadingKey: LOADING_KEYS.ASSESSMENTS_GET_LIST,
    apiFunc: () => MasterDataService.getAssessments(params),
    onSuccess: function* (response) {
      const { data, meta } = response.data.data;
      yield put(setAssessmentsList(data));
      yield put(setTotalRecords(meta.total));
      yield put(setTotalPages(meta.totalPages));
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(assessmentsActions.fetchAssessments().type, fetchAssessmentsSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
