import { all, put, select, takeLatest } from 'redux-saga/effects';

import { LOADING_KEYS } from '@/constants/loadingKeys';
import { toastMessages } from '@/constants/toastMessages';
import {
  addNotification,
  TOASTER_VARIANT,
} from '@/core/store/notificationSlice';
import { apiCall, createSagaActions } from '@/core/store/sagaHelpers';
import store from '@/core/store/store';
import SubOrganizationDataService from '@/services/appDataService/SubOrganizationDataService';

import {
  componentKey,
  setSubOrgList,
  setTotalRecords,
  setTotalPages,
  setDrawerOpen,
  setEditDrawer,
  setRefreshList,
  setStatusModal,
} from './subOrgListSlice';

export const subOrgListActions = createSagaActions(componentKey, [
  'fetchSubOrganizations',
  'fetchSubOrgById',
  'createSubOrganization',
  'updateSubOrganization',
  'changeSubOrgStatus',
  'archiveSubOrganization',
]);

function* fetchSubOrganizationsSaga() {
  const state = yield select((s) => s[componentKey]);
  const { page, limit, search, showArchived, statusFilter, sortKey, sortOrder } = state;

  const params = { page, limit };
  if (search) params.search = search;
  if (showArchived) params.showArchived = showArchived;
  if (statusFilter) params.status = statusFilter.value;
  if (sortKey) params.sortBy = sortKey;
  if (sortOrder) params.sortOrder = sortOrder;

  yield* apiCall({
    loadingKey: LOADING_KEYS.SUB_ORG_LIST_GET_LIST,
    apiFunc: () => SubOrganizationDataService.getSubOrganizations(params),
    onSuccess: function* (response) {
      const { data, meta } = response.data.data;
      yield put(setSubOrgList(data));
      yield put(setTotalRecords(meta.total));
      yield put(setTotalPages(meta.totalPages));
    },
  });
}

function* createSubOrganizationSaga(action) {
  const { data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.SUB_ORG_LIST_POST_CREATE,
    apiFunc: () => SubOrganizationDataService.createSubOrganization(data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.subOrgCreatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setDrawerOpen(false));
      yield put(setRefreshList());
    },
  });
}

function* fetchSubOrgByIdSaga(action) {
  const { id } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.SUB_ORG_LIST_GET_BY_ID,
    apiFunc: () => SubOrganizationDataService.getSubOrganizationById(id),
    onSuccess: function* (response) {
      yield put(setEditDrawer({ open: true, data: response.data.data }));
    },
  });
}

function* updateSubOrganizationSaga(action) {
  const { id, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.SUB_ORG_LIST_PATCH_UPDATE,
    apiFunc: () => SubOrganizationDataService.updateSubOrganization(id, data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.subOrgUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setEditDrawer({ open: false, data: null }));
      yield put(setRefreshList());
    },
  });
}

function* archiveSubOrganizationSaga(action) {
  const { id, isArchived } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.SUB_ORG_LIST_PATCH_ARCHIVE,
    apiFunc: () =>
      isArchived
        ? SubOrganizationDataService.unarchiveSubOrganization(id)
        : SubOrganizationDataService.archiveSubOrganization(id),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: isArchived
            ? toastMessages.subOrgUnarchivedSuccess
            : toastMessages.subOrgArchivedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshList());
    },
  });
}

function* changeSubOrgStatusSaga(action) {
  const { id, status } = action.payload;
  const isActivating = status === 'ACTIVE';

  yield put(setStatusModal({ open: false, step: 1, row: null }));

  yield* apiCall({
    loadingKey: LOADING_KEYS.SUB_ORG_LIST_PATCH_STATUS,
    apiFunc: () => SubOrganizationDataService.changeStatus(id, status),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: isActivating
            ? toastMessages.subOrgActivatedSuccess
            : toastMessages.subOrgDeactivatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshList());
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(subOrgListActions.fetchSubOrganizations().type, fetchSubOrganizationsSaga),
    takeLatest(subOrgListActions.fetchSubOrgById().type, fetchSubOrgByIdSaga),
    takeLatest(subOrgListActions.createSubOrganization().type, createSubOrganizationSaga),
    takeLatest(subOrgListActions.updateSubOrganization().type, updateSubOrganizationSaga),
    takeLatest(subOrgListActions.changeSubOrgStatus().type, changeSubOrgStatusSaga),
    takeLatest(subOrgListActions.archiveSubOrganization().type, archiveSubOrganizationSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
