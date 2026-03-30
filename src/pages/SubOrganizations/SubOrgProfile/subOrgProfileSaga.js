import { all, put, takeLatest } from 'redux-saga/effects';

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
  setProfile,
  setCloseDrawer,
  setRefreshProfile,
} from './subOrgProfileSlice';

export const subOrgProfileActions = createSagaActions(componentKey, [
  'fetchProfile',
  'updateProfile',
]);

function* fetchProfileSaga(action) {
  const { id } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.SUB_ORG_PROFILE_GET_BY_ID,
    apiFunc: () => SubOrganizationDataService.getSubOrganizationById(id),
    onSuccess: function* (response) {
      yield put(setProfile(response.data.data));
    },
  });
}

function* updateProfileSaga(action) {
  const { id, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.SUB_ORG_PROFILE_PATCH_UPDATE,
    apiFunc: () => SubOrganizationDataService.updateSubOrganization(id, data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.subOrgProfileUpdatedSuccess,
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
    takeLatest(subOrgProfileActions.fetchProfile().type, fetchProfileSaga),
    takeLatest(subOrgProfileActions.updateProfile().type, updateProfileSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
