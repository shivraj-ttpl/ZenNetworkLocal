import { all, put, takeLatest } from "redux-saga/effects";

import { LOADING_KEYS } from "@/constants/loadingKeys";
import { toastMessages } from "@/constants/toastMessages";
import { addNotification, TOASTER_VARIANT } from "@/core/store/notificationSlice";
import { apiCall, createSagaActions } from "@/core/store/sagaHelpers";
import store from "@/core/store/store";

import SettingsProfileDataService from "../../../services/appDataService/SettingsProfileDataService";
import { componentKey, setProfileData } from "./settingsProfileSlice";

export const settingsProfileActions = createSagaActions(componentKey, [
  "fetchProfile",
  "fetchOrgProfile",
  "updateOrgProfile",
]);

function* fetchProfileSaga() {
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_PROFILE_GET,
    apiFunc: () => SettingsProfileDataService.getProfile(),
    onSuccess: function* (response) {
      yield put(setProfileData(response.data.data));
    },
  });
}

function* fetchOrgProfileSaga() {
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_ORG_PROFILE_GET,
    apiFunc: () => SettingsProfileDataService.getOrgProfile(),
    onSuccess: function* (response) {
      yield put(setProfileData(response.data.data));
    },
  });
}

function* updateOrgProfileSaga(action) {
  const { payload, onSuccess } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_ORG_PROFILE_PATCH,
    apiFunc: () => SettingsProfileDataService.updateOrgProfile(payload),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.settingsProfileUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      if (onSuccess) onSuccess();
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(settingsProfileActions.fetchProfile().type, fetchProfileSaga),
    takeLatest(settingsProfileActions.fetchOrgProfile().type, fetchOrgProfileSaga),
    takeLatest(settingsProfileActions.updateOrgProfile().type, updateOrgProfileSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
