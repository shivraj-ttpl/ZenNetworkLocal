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
  closeDrawer,
  componentKey,
  setCodesList,
  setRefreshCodes,
  setTotalPages,
  setTotalRecords,
} from './codesSlice';

export const codesActions = createSagaActions(componentKey, [
  'fetchCodes',
  'createCode',
  'updateCode',
  'toggleFavorite',
  'archiveCode',
  'unarchiveCode',
  'downloadTemplate',
  'importCodes',
]);

function* fetchCodesSaga(action) {
  const { type } = action.payload;
  const state = yield select((s) => s[componentKey]);
  const { page, limit, search, showArchived } = state;

  const params = { page, limit };
  if (search) params.search = search;
  if (showArchived) params.showArchived = showArchived;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CODES_GET_LIST,
    apiFunc: () => MasterDataService.getCodes(type, params),
    onSuccess: function* (response) {
      const { data, meta } = response.data.data;
      yield put(setCodesList(data));
      yield put(setTotalRecords(meta.total));
      yield put(setTotalPages(meta.totalPages));
    },
  });
}

function* createCodeSaga(action) {
  const { type, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CODES_POST_CREATE,
    apiFunc: () => MasterDataService.createCode(type, data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.codeCreatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(closeDrawer());
      yield put(setRefreshCodes());
    },
  });
}

function* updateCodeSaga(action) {
  const { type, id, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CODES_PATCH_UPDATE,
    apiFunc: () => MasterDataService.updateCode(type, id, data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.codeUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(closeDrawer());
      yield put(setRefreshCodes());
    },
  });
}

function* toggleFavoriteSaga(action) {
  const { type, id } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CODES_PATCH_FAVORITE,
    apiFunc: () => MasterDataService.toggleFavorite(type, id),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.codeFavoriteToggled,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshCodes());
    },
  });
}

function* archiveCodeSaga(action) {
  const { type, id } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CODES_PATCH_ARCHIVE,
    apiFunc: () => MasterDataService.archiveCode(type, id),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.codeArchivedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshCodes());
    },
  });
}

function* unarchiveCodeSaga(action) {
  const { type, id } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CODES_PATCH_ARCHIVE,
    apiFunc: () => MasterDataService.unarchiveCode(type, id),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.codeUnarchivedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshCodes());
    },
  });
}

function* downloadTemplateSaga(action) {
  const { type } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CODES_GET_TEMPLATE,
    apiFunc: () => MasterDataService.downloadTemplate(type),
    // eslint-disable-next-line require-yield
    onSuccess: function* (response) {
      downloadBlobFile(response.data, `${type}-codes-template.csv`, 'text/csv');
    },
  });
}

function* importCodesSaga(action) {
  const { type, file } = action.payload;
  const formData = new FormData();
  formData.append('file', file);

  yield* apiCall({
    loadingKey: LOADING_KEYS.CODES_POST_IMPORT,
    apiFunc: () => MasterDataService.importCodes(type, formData),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.codesImportedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshCodes());
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(codesActions.fetchCodes().type, fetchCodesSaga),
    takeLatest(codesActions.createCode().type, createCodeSaga),
    takeLatest(codesActions.updateCode().type, updateCodeSaga),
    takeLatest(codesActions.toggleFavorite().type, toggleFavoriteSaga),
    takeLatest(codesActions.archiveCode().type, archiveCodeSaga),
    takeLatest(codesActions.unarchiveCode().type, unarchiveCodeSaga),
    takeLatest(codesActions.downloadTemplate().type, downloadTemplateSaga),
    takeLatest(codesActions.importCodes().type, importCodesSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
