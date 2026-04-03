import { all, put, takeLatest } from "redux-saga/effects";

import { LOADING_KEYS } from "@/constants/loadingKeys";
import { toastMessages } from "@/constants/toastMessages";
import { addNotification, TOASTER_VARIANT } from "@/core/store/notificationSlice";
import { apiCall, createSagaActions } from "@/core/store/sagaHelpers";
import store from "@/core/store/store";
import SettingsProfileDataService from "@/services/appDataService/SettingsProfileDataService";

import { componentKey, setUsersData, setUserDetail, setRefreshUsers } from "./settingsUsersSlice";

export const settingsUsersActions = createSagaActions(componentKey, [
  "fetchUsers",
  "fetchUserById",
  "updateUserStatus",
  "createUser",
  "updateUser",
  "archiveUser",
  "unarchiveUser",
  "sendInvitation",
]);

function* fetchUsersSaga(action) {
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_USERS_GET_LIST,
    apiFunc: () => SettingsProfileDataService.getUsers(action.payload),
    onSuccess: function* (response) {
      yield put(setUsersData(response?.data?.data));
    },
  });
}

function* fetchUserByIdSaga(action) {
  const { userId, mode } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_USERS_GET_BY_ID,
    apiFunc: () => SettingsProfileDataService.getUserById(userId),
    onSuccess: function* (response) {
      yield put(setUserDetail({ data: response?.data?.data, mode }));
    },
  });
}

function* updateUserStatusSaga(action) {
  const { userId, status } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_USERS_PATCH_STATUS,
    apiFunc: () => SettingsProfileDataService.updateUserStatus(userId, status),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.settingsUserStatusUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshUsers());
    },
  });
}

function* createUserSaga(action) {
  const { payload, onSuccess } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_USERS_POST_CREATE,
    apiFunc: () => SettingsProfileDataService.createUser(payload),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.settingsUserCreatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshUsers());
      if (onSuccess) onSuccess();
    },
  });
}

function* updateUserSaga(action) {
  const { userId, payload, onSuccess } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_USERS_PATCH_UPDATE,
    apiFunc: () => SettingsProfileDataService.updateUser(userId, payload),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.settingsUserUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshUsers());
      if (onSuccess) onSuccess();
    },
  });
}

function* archiveUserSaga(action) {
  const { userId } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_USERS_PATCH_ARCHIVE,
    apiFunc: () => SettingsProfileDataService.archiveUser(userId),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.settingsUserArchivedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshUsers());
    },
  });
}

function* unarchiveUserSaga(action) {
  const { userId } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_USERS_PATCH_ARCHIVE,
    apiFunc: () => SettingsProfileDataService.unarchiveUser(userId),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.settingsUserUnarchivedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshUsers());
    },
  });
}

function* sendInvitationSaga(action) {
  const { userId } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_USERS_POST_SEND_INVITATION,
    apiFunc: () => SettingsProfileDataService.sendInvitation(userId),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.settingsUserInvitationSentSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(settingsUsersActions.fetchUsers().type, fetchUsersSaga),
    takeLatest(settingsUsersActions.fetchUserById().type, fetchUserByIdSaga),
    takeLatest(settingsUsersActions.updateUserStatus().type, updateUserStatusSaga),
    takeLatest(settingsUsersActions.createUser().type, createUserSaga),
    takeLatest(settingsUsersActions.updateUser().type, updateUserSaga),
    takeLatest(settingsUsersActions.archiveUser().type, archiveUserSaga),
    takeLatest(settingsUsersActions.unarchiveUser().type, unarchiveUserSaga),
    takeLatest(settingsUsersActions.sendInvitation().type, sendInvitationSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
