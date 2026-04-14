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
  setConfiguration,
  setRefreshConfiguration,
} from './providerGroupConfigurationSlice';

export const providerGroupConfigurationActions = createSagaActions(
  componentKey,
  [
    'fetchConfiguration',
    'createCallerId',
    'deleteCallerId',
    'createSenderEmail',
    'deleteSenderEmail',
  ],
);

function* fetchConfigurationSaga(action) {
  const { providerGroupId, tenantName } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PG_CONFIGURATION_GET,
    apiFunc: () =>
      ProviderGroupDataService.getConfiguration(providerGroupId, tenantName),
    onSuccess: function* (response) {
      yield put(setConfiguration(response.data.data));
    },
  });
}

function* createCallerIdSaga(action) {
  const { providerGroupId, tenantName, data, resetForm } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PG_CONFIGURATION_POST_CALLER_ID,
    apiFunc: () =>
      ProviderGroupDataService.createCallerIdVerification(
        providerGroupId,
        tenantName,
        data,
      ),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.callerIdCreatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshConfiguration());
      resetForm?.();
    },
  });
}

function* deleteCallerIdSaga(action) {
  const { providerGroupId, tenantName } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PG_CONFIGURATION_DELETE_CALLER_ID,
    apiFunc: () =>
      ProviderGroupDataService.deleteCallerIdVerification(
        providerGroupId,
        tenantName,
      ),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.callerIdDeletedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshConfiguration());
    },
  });
}

function* createSenderEmailSaga(action) {
  const { providerGroupId, tenantName, data, resetForm } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PG_CONFIGURATION_POST_SENDER_EMAIL,
    apiFunc: () =>
      ProviderGroupDataService.createSenderEmail(
        providerGroupId,
        tenantName,
        data,
      ),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.senderEmailCreatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshConfiguration());
      resetForm?.();
    },
  });
}

function* deleteSenderEmailSaga(action) {
  const { providerGroupId, tenantName } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PG_CONFIGURATION_DELETE_SENDER_EMAIL,
    apiFunc: () =>
      ProviderGroupDataService.deleteSenderEmail(providerGroupId, tenantName),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.senderEmailDeletedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshConfiguration());
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(
      providerGroupConfigurationActions.fetchConfiguration().type,
      fetchConfigurationSaga,
    ),
    takeLatest(
      providerGroupConfigurationActions.createCallerId().type,
      createCallerIdSaga,
    ),
    takeLatest(
      providerGroupConfigurationActions.deleteCallerId().type,
      deleteCallerIdSaga,
    ),
    takeLatest(
      providerGroupConfigurationActions.createSenderEmail().type,
      createSenderEmailSaga,
    ),
    takeLatest(
      providerGroupConfigurationActions.deleteSenderEmail().type,
      deleteSenderEmailSaga,
    ),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
