import { all, put, takeLatest } from "redux-saga/effects";

import { LOADING_KEYS } from "@/constants/loadingKeys";
import { toastMessages } from "@/constants/toastMessages";
import { addNotification, TOASTER_VARIANT } from "@/core/store/notificationSlice";
import { apiCall, createSagaActions } from "@/core/store/sagaHelpers";
import store from "@/core/store/store";
import UsersDataService from "@/services/appDataService/UsersDataService";

import { componentKey, setUserProfileData } from "./userProfileSlice";

export const userProfileActions = createSagaActions(componentKey, [
  "fetchUserProfile",
  "updateUserProfile",
]);

function* fetchUserProfileSaga(action) {
  const { userId } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.USERS_GET_PROFILE,
    apiFunc: () => UsersDataService.getUserById(userId),
    onSuccess: function* (response) {
      yield put(setUserProfileData(response.data.data));
    },
  });
}

function* updateUserProfileSaga(action) {
  const { userId, payload, onSuccess } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.USERS_PATCH_PROFILE,
    apiFunc: () => UsersDataService.updateUser(userId, payload),
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
    takeLatest(userProfileActions.fetchUserProfile().type, fetchUserProfileSaga),
    takeLatest(userProfileActions.updateUserProfile().type, updateUserProfileSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
