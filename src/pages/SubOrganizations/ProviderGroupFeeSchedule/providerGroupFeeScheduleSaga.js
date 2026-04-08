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
  setCloseDeleteModal,
  setCloseDrawer,
  setFeeScheduleList,
  setRefreshFeeSchedule,
  setTotalRecords,
} from './providerGroupFeeScheduleSlice';

export const feeScheduleActions = createSagaActions(componentKey, [
  'fetchFeeSchedules',
  'createFeeSchedule',
  'updateFeeSchedule',
  'deleteFeeSchedule',
]);

function* fetchFeeSchedulesSaga(action) {
  const { providerGroupId, tenantName, ...params } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.FEE_SCHEDULE_GET_LIST,
    apiFunc: () =>
      ProviderGroupDataService.getFeeSchedules(providerGroupId, tenantName, {
        ...params,
      }),
    onSuccess: function* (response) {
      const { data, meta } = response.data.data;
      yield put(setFeeScheduleList(data));
      yield put(setTotalRecords(meta.total));
    },
  });
}

function* createFeeScheduleSaga(action) {
  const { providerGroupId, tenantName, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.FEE_SCHEDULE_POST_CREATE,
    apiFunc: () =>
      ProviderGroupDataService.createFeeSchedule(
        providerGroupId,
        tenantName,
        data,
      ),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.feeScheduleCreatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseDrawer());
      yield put(setRefreshFeeSchedule());
    },
  });
}

function* updateFeeScheduleSaga(action) {
  const { id, providerGroupId, tenantName, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.FEE_SCHEDULE_PATCH_UPDATE,
    apiFunc: () =>
      ProviderGroupDataService.updateFeeSchedule(
        id,
        providerGroupId,
        tenantName,
        data,
      ),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.feeScheduleUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseDrawer());
      yield put(setRefreshFeeSchedule());
    },
  });
}

function* deleteFeeScheduleSaga(action) {
  const { id, providerGroupId, tenantName } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.FEE_SCHEDULE_DELETE,
    apiFunc: () =>
      ProviderGroupDataService.deleteFeeSchedule(
        id,
        providerGroupId,
        tenantName,
      ),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.feeScheduleDeletedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseDeleteModal());
      yield put(setRefreshFeeSchedule());
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(
      feeScheduleActions.fetchFeeSchedules().type,
      fetchFeeSchedulesSaga,
    ),
    takeLatest(
      feeScheduleActions.createFeeSchedule().type,
      createFeeScheduleSaga,
    ),
    takeLatest(
      feeScheduleActions.updateFeeSchedule().type,
      updateFeeScheduleSaga,
    ),
    takeLatest(
      feeScheduleActions.deleteFeeSchedule().type,
      deleteFeeScheduleSaga,
    ),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
