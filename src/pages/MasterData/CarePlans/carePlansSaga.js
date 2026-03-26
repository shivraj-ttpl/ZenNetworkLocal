import { all, put, select, takeLatest } from 'redux-saga/effects';

import { LOADING_KEYS } from '@/constants/loadingKeys';
import { toastMessages } from '@/constants/toastMessages';
import {
  addNotification,
  TOASTER_VARIANT,
} from '@/core/store/notificationSlice';
import { apiCall, createSagaActions } from '@/core/store/sagaHelpers';
import store from '@/core/store/store';
import MasterDataService from '@/services/appDataService/MasterDataService';

import {
  componentKey,
  setCarePlansList,
  setTotalRecords,
  setTotalPages,
  setRefreshCarePlans,
} from './carePlansSlice';

export const carePlansActions = createSagaActions(componentKey, [
  'fetchCarePlans',
  'toggleFavorite',
  'archiveCarePlan',
]);

function* fetchCarePlansSaga() {
  const state = yield select((s) => s[componentKey]);
  const { page, limit, search, showArchived } = state;

  const params = { page, limit };
  if (search) params.search = search;
  if (showArchived) params.showArchived = showArchived;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CARE_PLANS_GET_LIST,
    apiFunc: () => MasterDataService.getCarePlans(params),
    onSuccess: function* (response) {
      const { data, meta } = response.data.data;
      yield put(setCarePlansList(data));
      yield put(setTotalRecords(meta.total));
      yield put(setTotalPages(meta.totalPages));
    },
  });
}

function* toggleFavoriteSaga(action) {
  const { id } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CARE_PLANS_PATCH_FAVORITE,
    apiFunc: () => MasterDataService.toggleCarePlanFavorite(id),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.carePlanFavoriteToggled,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshCarePlans());
    },
  });
}

function* archiveCarePlanSaga(action) {
  const { id, isArchived } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CARE_PLANS_PATCH_ARCHIVE,
    apiFunc: () =>
      isArchived
        ? MasterDataService.unarchiveCarePlan(id)
        : MasterDataService.archiveCarePlan(id),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: isArchived
            ? toastMessages.carePlanUnarchivedSuccess
            : toastMessages.carePlanArchivedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshCarePlans());
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(carePlansActions.fetchCarePlans().type, fetchCarePlansSaga),
    takeLatest(carePlansActions.toggleFavorite().type, toggleFavoriteSaga),
    takeLatest(carePlansActions.archiveCarePlan().type, archiveCarePlanSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
