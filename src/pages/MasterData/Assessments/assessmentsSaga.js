import { all, put, select, takeLatest } from 'redux-saga/effects';

import { LOADING_KEYS } from '@/constants/loadingKeys';
import { toastMessages } from '@/constants/toastMessages';
import {
  addNotification,
  TOASTER_VARIANT,
} from '@/core/store/notificationSlice';
import { apiCall, createSagaActions } from '@/core/store/sagaHelpers';
import store from '@/core/store/store';
import MasterDataService from '@/services/appDataService/MasterDataService';

import {
  componentKey,
  setAssessmentsList,
  setRefreshAssessments,
  setTotalPages,
  setTotalRecords,
} from './assessmentsSlice';

export const assessmentsActions = createSagaActions(componentKey, [
  'fetchAssessments',
  'toggleFavorite',
  'archiveAssessment',
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

function* toggleFavoriteSaga(action) {
  const { id } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.ASSESSMENTS_PATCH_FAVORITE,
    apiFunc: () => MasterDataService.toggleAssessmentFavorite(id),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.assessmentFavoriteToggled,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshAssessments());
    },
  });
}

function* archiveAssessmentSaga(action) {
  const { id, isArchived } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.ASSESSMENTS_PATCH_ARCHIVE,
    apiFunc: () =>
      MasterDataService.archiveAssessment(id, { isArchived: !isArchived }),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: isArchived
            ? toastMessages.assessmentUnarchivedSuccess
            : toastMessages.assessmentArchivedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshAssessments());
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(
      assessmentsActions.fetchAssessments().type,
      fetchAssessmentsSaga,
    ),
    takeLatest(assessmentsActions.toggleFavorite().type, toggleFavoriteSaga),
    takeLatest(
      assessmentsActions.archiveAssessment().type,
      archiveAssessmentSaga,
    ),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
