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
import { downloadBlobFile } from '@/utils/GeneralUtils';

import {
  componentKey,
  setEducationList,
  setTotalRecords,
  setTotalPages,
  setCloseDrawer,
  setRefreshEducation,
} from './educationSlice';

export const educationActions = createSagaActions(componentKey, [
  'fetchEducation',
  'createEducation',
  'updateEducation',
  'toggleFavorite',
  'archiveEducation',
  'downloadEducation',
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

function* createEducationSaga(action) {
  const { data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.EDUCATION_POST_CREATE,
    apiFunc: () => MasterDataService.createEducation(data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.educationCreatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseDrawer());
      yield put(setRefreshEducation());
    },
  });
}

function* updateEducationSaga(action) {
  const { id, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.EDUCATION_PATCH_UPDATE,
    apiFunc: () => MasterDataService.updateEducation(id, data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.educationUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseDrawer());
      yield put(setRefreshEducation());
    },
  });
}

function* toggleFavoriteSaga(action) {
  const { id } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.EDUCATION_PATCH_FAVORITE,
    apiFunc: () => MasterDataService.toggleEducationFavorite(id),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.educationFavoriteToggled,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshEducation());
    },
  });
}

function* archiveEducationSaga(action) {
  const { id, isArchived } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.EDUCATION_PATCH_ARCHIVE,
    apiFunc: () =>
      MasterDataService.archiveEducation(id, { isArchived: !isArchived }),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: isArchived
            ? toastMessages.educationUnarchivedSuccess
            : toastMessages.educationArchivedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshEducation());
    },
  });
}

function* downloadEducationSaga(action) {
  const { id, fileName } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.EDUCATION_GET_DOWNLOAD,
    apiFunc: () => MasterDataService.downloadEducation(id),
    // eslint-disable-next-line require-yield
    onSuccess: function* (response) {
      downloadBlobFile(response.data, fileName || 'download');
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(educationActions.fetchEducation().type, fetchEducationSaga),
    takeLatest(educationActions.createEducation().type, createEducationSaga),
    takeLatest(educationActions.updateEducation().type, updateEducationSaga),
    takeLatest(educationActions.toggleFavorite().type, toggleFavoriteSaga),
    takeLatest(educationActions.archiveEducation().type, archiveEducationSaga),
    takeLatest(educationActions.downloadEducation().type, downloadEducationSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
