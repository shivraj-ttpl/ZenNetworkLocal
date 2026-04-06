import { all, put, takeLatest } from 'redux-saga/effects';

import { LOADING_KEYS } from '@/constants/loadingKeys';
import { toastMessages } from '@/constants/toastMessages';
import { addNotification, TOASTER_VARIANT } from '@/core/store/notificationSlice';
import { apiCall, createSagaActions } from '@/core/store/sagaHelpers';
import store from '@/core/store/store';
import SettingsRolesDataService from '@/services/appDataService/SettingsRolesDataService';

import {
  componentKey,
  setRolesData,
  setRoleDetail,
  setRefreshRoles,
} from './subOrgRolesPermissionsSlice';

export const subOrgRolesActions = createSagaActions(componentKey, [
  'fetchRoles',
  'fetchRoleById',
  'createRole',
  'updateRolePermissions',
  'updateRoleStatus',
  'archiveRole',
]);

function* fetchRolesSaga(action) {
  yield* apiCall({
    loadingKey: LOADING_KEYS.SUB_ORG_ROLES_GET_LIST,
    apiFunc: () => SettingsRolesDataService.getRoles(action.payload),
    onSuccess: function* (response) {
      yield put(setRolesData(response?.data?.data));
    },
  });
}

function* fetchRoleByIdSaga(action) {
  const { roleId } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.SUB_ORG_ROLES_GET_BY_ID,
    apiFunc: () => SettingsRolesDataService.getRoleById(roleId),
    onSuccess: function* (response) {
      yield put(setRoleDetail(response?.data?.data));
    },
  });
}

function* createRoleSaga(action) {
  const { payload, onSuccess } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.SUB_ORG_ROLES_POST_CREATE,
    apiFunc: () => SettingsRolesDataService.createRole(payload),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.subOrgRoleCreatedSuccess,
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
    loadingKey: LOADING_KEYS.SUB_ORG_ROLES_PATCH_UPDATE,
    apiFunc: () => SettingsRolesDataService.updateRolePermissions(roleId, payload),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.subOrgRoleUpdatedSuccess,
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
    loadingKey: LOADING_KEYS.SUB_ORG_ROLES_PATCH_STATUS,
    apiFunc: () => SettingsRolesDataService.updateRoleStatus(roleId, status),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.subOrgRoleStatusUpdatedSuccess,
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
    loadingKey: LOADING_KEYS.SUB_ORG_ROLES_PATCH_ARCHIVE,
    apiFunc: () =>
      isArchived
        ? SettingsRolesDataService.unarchiveRole(roleId)
        : SettingsRolesDataService.archiveRole(roleId),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: isArchived
            ? toastMessages.subOrgRoleUnarchivedSuccess
            : toastMessages.subOrgRoleArchivedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshRoles());
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(subOrgRolesActions.fetchRoles().type, fetchRolesSaga),
    takeLatest(subOrgRolesActions.fetchRoleById().type, fetchRoleByIdSaga),
    takeLatest(subOrgRolesActions.createRole().type, createRoleSaga),
    takeLatest(subOrgRolesActions.updateRolePermissions().type, updateRolePermissionsSaga),
    takeLatest(subOrgRolesActions.updateRoleStatus().type, updateRoleStatusSaga),
    takeLatest(subOrgRolesActions.archiveRole().type, archiveRoleSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
