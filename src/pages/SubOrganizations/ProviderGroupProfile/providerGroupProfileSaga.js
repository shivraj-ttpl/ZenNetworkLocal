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
  setProfile,
  setRefreshProfile,
} from './providerGroupProfileSlice';

export const providerGroupProfileActions = createSagaActions(componentKey, [
  'fetchProfile',
  'updateProfile',
]);

function* fetchProfileSaga(action) {
  const { id, tenantName } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_PROFILE_GET_BY_ID,
    apiFunc: () =>
      ProviderGroupDataService.getProviderGroupById(id, tenantName),
    onSuccess: function* (response) {
      yield put(setProfile(response.data.data));
    },
  });
}

function* updateProfileSaga(action) {
  const { id, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_PROFILE_PUT_UPDATE,
    apiFunc: () => ProviderGroupDataService.updateProviderGroup(id, data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.providerGroupProfileUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseDrawer());
      yield put(setRefreshProfile());
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(
      providerGroupProfileActions.fetchProfile().type,
      fetchProfileSaga,
    ),
    takeLatest(
      providerGroupProfileActions.updateProfile().type,
      updateProfileSaga,
    ),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
