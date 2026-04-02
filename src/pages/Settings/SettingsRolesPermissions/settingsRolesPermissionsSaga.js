import { all, put, takeLatest } from "redux-saga/effects";

import { LOADING_KEYS } from "@/constants/loadingKeys";
import { toastMessages } from "@/constants/toastMessages";
import { addNotification, TOASTER_VARIANT } from "@/core/store/notificationSlice";
import { apiCall, createSagaActions } from "@/core/store/sagaHelpers";
import store from "@/core/store/store";
import SettingsRolesDataService from "@/services/appDataService/SettingsRolesDataService";

import { componentKey, setRolesData, setRoleDetail, setRefreshRoles } from "./settingsRolesPermissionsSlice";

export const settingsRolesActions = createSagaActions(componentKey, [
  "fetchRoles",
  "fetchRoleById",
  "createRole",
  "updateRolePermissions",
  "updateRoleStatus",
  "archiveRole",
]);

function* fetchRolesSaga(action) {
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_ROLES_GET_LIST,
    apiFunc: () => SettingsRolesDataService.getRoles(action.payload),
    onSuccess: function* (response) {
      yield put(setRolesData(response?.data?.data));
    },
  });
}

function* fetchRoleByIdSaga(action) {
  const { roleId } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_ROLES_GET_BY_ID,
    apiFunc: () => SettingsRolesDataService.getRoleById(roleId),
    onSuccess: function* (response) {
      yield put(setRoleDetail(response?.data?.data));
    },
  });
}

function* createRoleSaga(action) {
  const { payload, onSuccess } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_ROLES_POST_CREATE,
    apiFunc: () => SettingsRolesDataService.createRole(payload),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.settingsRoleCreatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      if (onSuccess) onSuccess();
    },
  });
}

function* updateRolePermissionsSaga(action) {
  const { roleId, payload, onSuccess } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_ROLES_PATCH_UPDATE,
    apiFunc: () => SettingsRolesDataService.updateRolePermissions(roleId, payload),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.settingsRoleUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRoleDetail(null));
      if (onSuccess) onSuccess();
    },
  });
}

function* updateRoleStatusSaga(action) {
  const { roleId, status } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_ROLES_PATCH_STATUS,
    apiFunc: () => SettingsRolesDataService.updateRoleStatus(roleId, status),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.settingsRoleStatusUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshRoles());
    },
  });
}

function* archiveRoleSaga(action) {
  const { roleId, isArchived } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.SETTINGS_ROLES_PATCH_ARCHIVE,
    apiFunc: () =>
      isArchived
        ? SettingsRolesDataService.unarchiveRole(roleId)
        : SettingsRolesDataService.archiveRole(roleId),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: isArchived
            ? toastMessages.settingsRoleUnarchivedSuccess
            : toastMessages.settingsRoleArchivedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshRoles());
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(settingsRolesActions.fetchRoles().type, fetchRolesSaga),
    takeLatest(settingsRolesActions.fetchRoleById().type, fetchRoleByIdSaga),
    takeLatest(settingsRolesActions.createRole().type, createRoleSaga),
    takeLatest(settingsRolesActions.updateRolePermissions().type, updateRolePermissionsSaga),
    takeLatest(settingsRolesActions.updateRoleStatus().type, updateRoleStatusSaga),
    takeLatest(settingsRolesActions.archiveRole().type, archiveRoleSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
