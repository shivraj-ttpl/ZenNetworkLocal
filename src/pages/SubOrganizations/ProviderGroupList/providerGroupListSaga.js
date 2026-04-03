import { all, put, select, takeLatest } from 'redux-saga/effects';

import { LOADING_KEYS } from '@/constants/loadingKeys';
import { toastMessages } from '@/constants/toastMessages';
import {
  addNotification,
  TOASTER_VARIANT,
} from '@/core/store/notificationSlice';
import { apiCall, createSagaActions } from '@/core/store/sagaHelpers';
import store from '@/core/store/store';
import ProviderGroupDataService from '@/services/appDataService/ProviderGroupDataService';

import {
  componentKey,
  setProviderGroupList,
  setTotalRecords,
  setTotalPages,
  setCloseDrawer,
  setEditDrawer,
  setRefreshList,
  setStatusModal,
} from './providerGroupListSlice';

export const providerGroupListActions = createSagaActions(componentKey, [
  'fetchProviderGroups',
  'fetchProviderGroupById',
  'createProviderGroup',
  'updateProviderGroup',
  'changeStatus',
  'archiveProviderGroup',
]);

function* fetchProviderGroupsSaga(action) {
  const { subOrgId } = action.payload;
  const state = yield select((s) => s[componentKey]);
  const { page, limit, search, showArchived, statusFilter, sortKey, sortOrder } =
    state;

  const params = { page, limit };
  if (search) params.search = search;
  if (showArchived) params.showArchived = showArchived;
  if (statusFilter) params.status = statusFilter.value;
  if (sortKey) params.sortBy = sortKey;
  if (sortOrder) params.sortOrder = sortOrder;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_LIST_GET_LIST,
    apiFunc: () => ProviderGroupDataService.getProviderGroups(subOrgId, params),
    onSuccess: function* (response) {
      const { data, meta } = response.data.data;
      yield put(setProviderGroupList(data));
      yield put(setTotalRecords(meta.total));
      yield put(setTotalPages(meta.totalPages));
    },
  });
}

function* fetchProviderGroupByIdSaga(action) {
  const { id } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_LIST_GET_BY_ID,
    apiFunc: () => ProviderGroupDataService.getProviderGroupById(id),
    onSuccess: function* (response) {
      yield put(setEditDrawer(response?.data?.data));
    },
  });
}

function* createProviderGroupSaga(action) {
  const { subOrgId, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_LIST_POST_CREATE,
    apiFunc: () =>
      ProviderGroupDataService.createProviderGroup(subOrgId, data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.providerGroupCreatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseDrawer());
      yield put(setRefreshList());
    },
  });
}

function* updateProviderGroupSaga(action) {
  const { id, data } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_LIST_POST_CREATE,
    apiFunc: () => ProviderGroupDataService.updateProviderGroup(id, data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.providerGroupUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseDrawer());
      yield put(setRefreshList());
    },
  });
}

function* changeStatusSaga(action) {
  const { id, status } = action.payload;
  const isActivating = status === 'ACTIVE';

  yield put(setStatusModal({ open: false, row: null }));

  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_LIST_PATCH_STATUS,
    apiFunc: () => ProviderGroupDataService.changeStatus(id, status),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: isActivating
            ? toastMessages.providerGroupActivatedSuccess
            : toastMessages.providerGroupDeactivatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshList());
    },
  });
}

function* archiveProviderGroupSaga(action) {
  const { id, isArchived } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_LIST_PATCH_ARCHIVE,
    apiFunc: () =>
      isArchived
        ? ProviderGroupDataService.unarchiveProviderGroup(id)
        : ProviderGroupDataService.archiveProviderGroup(id),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: isArchived
            ? toastMessages.providerGroupUnarchivedSuccess
            : toastMessages.providerGroupArchivedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshList());
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(
      providerGroupListActions.fetchProviderGroups().type,
      fetchProviderGroupsSaga,
    ),
    takeLatest(
      providerGroupListActions.fetchProviderGroupById().type,
      fetchProviderGroupByIdSaga,
    ),
    takeLatest(
      providerGroupListActions.createProviderGroup().type,
      createProviderGroupSaga,
    ),
    takeLatest(
      providerGroupListActions.updateProviderGroup().type,
      updateProviderGroupSaga,
    ),
    takeLatest(
      providerGroupListActions.changeStatus().type,
      changeStatusSaga,
    ),
    takeLatest(
      providerGroupListActions.archiveProviderGroup().type,
      archiveProviderGroupSaga,
    ),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
