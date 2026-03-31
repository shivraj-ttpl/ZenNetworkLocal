import { all, put, takeLatest } from "redux-saga/effects";

import { LOADING_KEYS } from "@/constants/loadingKeys";
import { apiCall, createSagaActions } from "@/core/store/sagaHelpers";
import store from "@/core/store/store";

import SettingsProfileDataService from "../../../services/appDataService/SettingsProfileDataService";
import { componentKey, setProfileData } from "./settingsProfileSlice";

export const settingsProfileActions = createSagaActions(componentKey, [
  "fetchProfile",
]);

function* fetchProfileSaga() {
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_PROFILE_GET,
    apiFunc: () => SettingsProfileDataService.getProfile(),
    onSuccess: function* (response) {
      console.log("res",response)
      yield put(setProfileData(response.data.data));
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(settingsProfileActions.fetchProfile().type, fetchProfileSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
