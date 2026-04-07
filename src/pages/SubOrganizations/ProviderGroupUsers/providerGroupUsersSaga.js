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
import UsersDataService from '@/services/appDataService/UsersDataService';

import {
  componentKey,
  setCloseDrawer,
  setRefreshUsers,
  setTotalRecords,
  setUserDetail,
  setUsersList,
} from './providerGroupUsersSlice';

export const providerGroupUsersActions = createSagaActions(componentKey, [
  'fetchUsers',
  'fetchUserById',
  'createUser',
  'updateUser',
  'updateUserStatus',
  'archiveUser',
]);

function* fetchUsersSaga(action) {
  const { providerGroupId, tenantName, ...params } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_USERS_GET_LIST,
    apiFunc: () =>
      ProviderGroupDataService.getProviderGroupUsers(
        providerGroupId,
        tenantName,
        params,
      ),
    onSuccess: function* (response) {
      const { data, meta } = response.data.data;
      yield put(setUsersList(data));
      yield put(setTotalRecords(meta.total));
    },
  });
}

function* fetchUserByIdSaga(action) {
  const { userId } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_USERS_GET_BY_ID,
    apiFunc: () => UsersDataService.getUserById(userId),
    onSuccess: function* (response) {
      yield put(setUserDetail(response.data.data));
    },
  });
}

function* createUserSaga(action) {
  const { providerGroupId, data } = action.payload;
  const {
    firstName,
    lastName,
    email,
    providerGroupRoleTitle,
    countryCode,
    contactNumber,
    address,
  } = data;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_USERS_POST_CREATE,
    apiFunc: () =>
      ProviderGroupDataService.createProviderGroupUser(providerGroupId, {
        firstName,
        lastName,
        email,
        providerGroupRoleTitle,
        countryCode,
        contactNumber,
        address,
      }),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.providerGroupUserCreatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseDrawer());
      yield put(setRefreshUsers());
    },
  });
}

function* updateUserSaga(action) {
  const { id, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_USERS_PATCH_UPDATE,
    apiFunc: () => ProviderGroupDataService.updateProviderGroupUser(id, data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.providerGroupUserUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseDrawer());
      yield put(setRefreshUsers());
    },
  });
}

function* updateUserStatusSaga(action) {
  const { userId, status } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_USERS_PATCH_STATUS,
    apiFunc: () =>
      ProviderGroupDataService.changeProviderGroupUserStatus(userId, status),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.providerGroupUserStatusUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshUsers());
    },
  });
}

function* archiveUserSaga(action) {
  const { userId, isArchived } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PROVIDER_GROUP_USERS_PATCH_ARCHIVE,
    apiFunc: () =>
      isArchived
        ? ProviderGroupDataService.unarchiveProviderGroupUser(userId)
        : ProviderGroupDataService.archiveProviderGroupUser(userId),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: isArchived
            ? toastMessages.providerGroupUserUnarchivedSuccess
            : toastMessages.providerGroupUserArchivedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshUsers());
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(providerGroupUsersActions.fetchUsers().type, fetchUsersSaga),
    takeLatest(
      providerGroupUsersActions.fetchUserById().type,
      fetchUserByIdSaga,
    ),
    takeLatest(providerGroupUsersActions.createUser().type, createUserSaga),
    takeLatest(providerGroupUsersActions.updateUser().type, updateUserSaga),
    takeLatest(
      providerGroupUsersActions.updateUserStatus().type,
      updateUserStatusSaga,
    ),
    takeLatest(providerGroupUsersActions.archiveUser().type, archiveUserSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
