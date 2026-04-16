import { all, put, takeLatest } from 'redux-saga/effects';

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
  setCloseDrawer,
  setCloseStatusModal,
  setProviderDetail,
  setProvidersList,
  setRefreshProviders,
  setTotalRecords,
} from './providerGroupProvidersSlice';

export const providerGroupProvidersActions = createSagaActions(componentKey, [
  'fetchProviders',
  'fetchProviderById',
  'createProvider',
  'updateProvider',
  'updateProviderStatus',
  'archiveProvider',
]);

function* fetchProvidersSaga(action) {
  const { providerGroupId, tenantName, ...params } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_PROVIDERS_GET_LIST,
    apiFunc: () =>
      ProviderGroupDataService.getProviderGroupProviders(
        providerGroupId,
        tenantName,
        params,
      ),
    onSuccess: function* (response) {
      const { data, meta } = response.data.data;
      yield put(setProvidersList(data));
      yield put(setTotalRecords(meta.total));
    },
  });
}

function* fetchProviderByIdSaga(action) {
  const { providerId, providerGroupId, tenantName } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_PROVIDERS_GET_BY_ID,
    apiFunc: () =>
      ProviderGroupDataService.getProviderById(
        providerId,
        providerGroupId,
        tenantName,
      ),
    onSuccess: function* (response) {
      yield put(setProviderDetail(response.data.data));
    },
  });
}

function* createProviderSaga(action) {
  const { providerGroupId, tenantName, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_PROVIDERS_POST_CREATE,
    apiFunc: () =>
      ProviderGroupDataService.createProvider(
        providerGroupId,
        tenantName,
        data,
      ),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.providerGroupProviderCreatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseDrawer());
      yield put(setRefreshProviders());
    },
  });
}

function* updateProviderSaga(action) {
  const { providerGroupId, providerId, tenantName, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_PROVIDERS_PATCH_UPDATE,
    apiFunc: () =>
      ProviderGroupDataService.updateProvider(
        providerGroupId,
        providerId,
        tenantName,
        data,
      ),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.providerGroupProviderUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseDrawer());
      yield put(setRefreshProviders());
    },
  });
}

function* updateProviderStatusSaga(action) {
  const { providerId, providerGroupId, tenantName, status } = action.payload;

  yield put(setCloseStatusModal());

  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_PROVIDERS_PATCH_STATUS,
    apiFunc: () =>
      ProviderGroupDataService.changeProviderStatus(
        providerId,
        providerGroupId,
        tenantName,
        status,
      ),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.providerGroupProviderStatusUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshProviders());
    },
  });
}

function* archiveProviderSaga(action) {
  const { providerId, isArchived } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_PROVIDERS_PATCH_ARCHIVE,
    apiFunc: () =>
      isArchived
        ? ProviderGroupDataService.unarchiveProviderGroupUser(providerId)
        : ProviderGroupDataService.archiveProviderGroupUser(providerId),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: isArchived
            ? toastMessages.providerGroupProviderUnarchivedSuccess
            : toastMessages.providerGroupProviderArchivedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshProviders());
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(
      providerGroupProvidersActions.fetchProviders().type,
      fetchProvidersSaga,
    ),
    takeLatest(
      providerGroupProvidersActions.fetchProviderById().type,
      fetchProviderByIdSaga,
    ),
    takeLatest(
      providerGroupProvidersActions.createProvider().type,
      createProviderSaga,
    ),
    takeLatest(
      providerGroupProvidersActions.updateProvider().type,
      updateProviderSaga,
    ),
    takeLatest(
      providerGroupProvidersActions.updateProviderStatus().type,
      updateProviderStatusSaga,
    ),
    takeLatest(
      providerGroupProvidersActions.archiveProvider().type,
      archiveProviderSaga,
    ),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
