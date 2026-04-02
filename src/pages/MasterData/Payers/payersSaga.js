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
  setPayersList,
  setTotalRecords,
  setTotalPages,
  setCloseDrawer,
  setCloseImportModal,
  setCloseStatusModal,
  setRefreshPayers,
} from './payersSlice';

export const payersActions = createSagaActions(componentKey, [
  'fetchPayers',
  'createPayer',
  'updatePayer',
  'togglePayerStatus',
  'togglePayerFavorite',
  'archivePayer',
  'importPayers',
  'downloadTemplate',
]);

function* fetchPayersSaga() {
  const state = yield select((s) => s[componentKey]);
  const { page, limit, search, showArchived, payerType, sortKey, sortOrder } = state;

  const params = { page, limit };
  if (search) params.search = search;
  if (showArchived) params.showArchived = showArchived;
  if (payerType) params.payerType = payerType.value;
  if (sortKey) params.sortBy = sortKey;
  if (sortOrder) params.sortOrder = sortOrder;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PAYERS_GET_LIST,
    apiFunc: () => MasterDataService.getPayers(params),
    onSuccess: function* (response) {
      const { data, meta } = response.data.data;
      yield put(setPayersList(data));
      yield put(setTotalRecords(meta.total));
      yield put(setTotalPages(meta.totalPages));
    },
  });
}

function* createPayerSaga(action) {
  const { data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PAYERS_POST_CREATE,
    apiFunc: () => MasterDataService.createPayer(data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.payerCreatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseDrawer());
      yield put(setRefreshPayers());
    },
  });
}

function* updatePayerSaga(action) {
  const { id, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PAYERS_PATCH_UPDATE,
    apiFunc: () => MasterDataService.updatePayer(id, data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.payerUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseDrawer());
      yield put(setRefreshPayers());
    },
  });
}

function* togglePayerStatusSaga(action) {
  const { id, currentStatus } = action.payload;
  const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

  yield* apiCall({
    loadingKey: LOADING_KEYS.PAYERS_PATCH_STATUS,
    apiFunc: () =>
      MasterDataService.togglePayerStatus(id, { status: newStatus }),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.payerStatusChanged,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseStatusModal());
      yield put(setRefreshPayers());
    },
  });
}

function* togglePayerFavoriteSaga(action) {
  const { id } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PAYERS_PATCH_FAVORITE,
    apiFunc: () => MasterDataService.togglePayerFavorite(id),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.payerFavoriteToggled,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshPayers());
    },
  });
}

function* archivePayerSaga(action) {
  const { id, isArchived } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PAYERS_PATCH_ARCHIVE,
    apiFunc: () =>
      MasterDataService.archivePayer(id, { isArchived: !isArchived }),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: isArchived
            ? toastMessages.payerUnarchivedSuccess
            : toastMessages.payerArchivedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshPayers());
    },
  });
}

function* downloadTemplateSaga() {
  yield* apiCall({
    loadingKey: LOADING_KEYS.PAYERS_GET_TEMPLATE,
    apiFunc: () => MasterDataService.downloadPayersTemplate(),
    // eslint-disable-next-line require-yield
    onSuccess: function* (response) {
      downloadBlobFile(response.data, 'payers-template.csv', 'text/csv');
    },
  });
}

function* importPayersSaga(action) {
  const { file } = action.payload;
  const formData = new FormData();
  formData.append('file', file);

  yield* apiCall({
    loadingKey: LOADING_KEYS.PAYERS_POST_IMPORT,
    apiFunc: () => MasterDataService.importPayers(formData),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.payersImportedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseImportModal());
      yield put(setRefreshPayers());
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(payersActions.fetchPayers().type, fetchPayersSaga),
    takeLatest(payersActions.createPayer().type, createPayerSaga),
    takeLatest(payersActions.updatePayer().type, updatePayerSaga),
    takeLatest(payersActions.togglePayerStatus().type, togglePayerStatusSaga),
    takeLatest(payersActions.togglePayerFavorite().type, togglePayerFavoriteSaga),
    takeLatest(payersActions.archivePayer().type, archivePayerSaga),
    takeLatest(payersActions.downloadTemplate().type, downloadTemplateSaga),
    takeLatest(payersActions.importPayers().type, importPayersSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
