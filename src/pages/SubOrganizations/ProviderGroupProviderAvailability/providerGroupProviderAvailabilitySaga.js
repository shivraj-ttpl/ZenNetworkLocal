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
  setCalendarData,
  setCloseBlockDayModal,
  setCloseConfigureDateDrawer,
  setCloseConfigureDrawer,
  setDateSlotsData,
  setRefreshCalendar,
} from './providerGroupProviderAvailabilitySlice';

export const availabilityActions = createSagaActions(componentKey, [
  'fetchCalendar',
  'fetchSlotsForDate',
  'bulkConfigure',
  'addBlockDay',
  'removeBlockDay',
  'convertBlockDay',
]);

function* fetchCalendarSaga(action) {
  const { providerGroupId, tenantName, month, mode } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.AVAILABILITY_GET_CALENDAR,
    apiFunc: () =>
      ProviderGroupDataService.getAvailabilityCalendar(
        providerGroupId,
        tenantName,
        { month, ...(mode ? { mode } : {}) },
      ),
    onSuccess: function* (response) {
      yield put(setCalendarData(response.data.data ?? response.data));
    },
  });
}

function* fetchSlotsForDateSaga(action) {
  const { providerGroupId, tenantName, date, month, mode } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.AVAILABILITY_GET_SLOTS_FOR_DATE,
    apiFunc: () =>
      ProviderGroupDataService.getAvailabilitySlotsForDate(
        providerGroupId,
        tenantName,
        date,
        { month, ...(mode ? { mode } : {}) },
      ),
    onSuccess: function* (response) {
      yield put(setDateSlotsData(response.data.data ?? response.data));
    },
  });
}

function* bulkConfigureSaga(action) {
  const { providerGroupId, tenantName, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.AVAILABILITY_POST_BULK_CONFIGURE,
    apiFunc: () =>
      ProviderGroupDataService.bulkConfigureAvailability(
        providerGroupId,
        tenantName,
        data,
      ),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.availabilityConfiguredSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseConfigureDrawer());
      yield put(setCloseConfigureDateDrawer());
      yield put(setRefreshCalendar());
    },
  });
}

function* addBlockDaySaga(action) {
  const { providerGroupId, tenantName, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.AVAILABILITY_POST_ADD_BLOCK_DAY,
    apiFunc: () =>
      ProviderGroupDataService.addBlockDay(providerGroupId, tenantName, data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.blockDayAddedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshCalendar());
    },
  });
}

function* removeBlockDaySaga(action) {
  const { providerGroupId, tenantName, date } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.AVAILABILITY_DELETE_BLOCK_DAY,
    apiFunc: () =>
      ProviderGroupDataService.removeBlockDay(
        providerGroupId,
        tenantName,
        date,
      ),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.blockDayRemovedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseBlockDayModal());
      yield put(setRefreshCalendar());
    },
  });
}

function* convertBlockDaySaga(action) {
  const { providerGroupId, tenantName, date, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.AVAILABILITY_PATCH_CONVERT_BLOCK_DAY,
    apiFunc: () =>
      ProviderGroupDataService.convertBlockDay(
        providerGroupId,
        tenantName,
        date,
        data,
      ),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.blockDayConvertedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseBlockDayModal());
      yield put(setRefreshCalendar());
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(availabilityActions.fetchCalendar().type, fetchCalendarSaga),
    takeLatest(
      availabilityActions.fetchSlotsForDate().type,
      fetchSlotsForDateSaga,
    ),
    takeLatest(availabilityActions.bulkConfigure().type, bulkConfigureSaga),
    takeLatest(availabilityActions.addBlockDay().type, addBlockDaySaga),
    takeLatest(availabilityActions.removeBlockDay().type, removeBlockDaySaga),
    takeLatest(availabilityActions.convertBlockDay().type, convertBlockDaySaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
