import { all, put, select, takeLatest } from 'redux-saga/effects';

import { LOADING_KEYS } from '@/constants/loadingKeys';
import { apiCall, createSagaActions } from '@/core/store/sagaHelpers';
import store from '@/core/store/store';
import MasterDataService from '@/services/appDataService/MasterDataService';

import {
  componentKey,
  setEducationList,
  setTotalRecords,
  setTotalPages,
} from './educationSlice';

export const educationActions = createSagaActions(componentKey, [
  'fetchEducation',
]);

function* fetchEducationSaga() {
  const state = yield select((s) => s[componentKey]);
  const { page, limit, search, showArchived, filterSpecialty, filterFileType } =
    state;

  const params = { page, limit };
  if (search) params.search = search;
  if (showArchived) params.showArchived = showArchived;
  if (filterSpecialty) params.specialty = filterSpecialty;
  if (filterFileType) params.fileType = filterFileType;

  yield* apiCall({
    loadingKey: LOADING_KEYS.EDUCATION_GET_LIST,
    apiFunc: () => MasterDataService.getEducation(params),
    onSuccess: function* (response) {
      const { data, meta } = response.data.data;
      yield put(setEducationList(data));
      yield put(setTotalRecords(meta.total));
      yield put(setTotalPages(meta.totalPages));
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(educationActions.fetchEducation().type, fetchEducationSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
