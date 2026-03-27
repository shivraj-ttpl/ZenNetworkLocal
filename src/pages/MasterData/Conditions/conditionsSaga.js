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
  setConditionsList,
  setTotalRecords,
  setTotalPages,
  setCloseDrawer,
  setRefreshConditions,
} from './conditionsSlice';

export const conditionsActions = createSagaActions(componentKey, [
  'fetchConditions',
  'createCondition',
  'updateCondition',
  'toggleFavorite',
  'archiveCondition',
]);

function* fetchConditionsSaga() {
  const state = yield select((s) => s[componentKey]);
  const { page, limit, search, showArchived } = state;

  const params = { page, limit };
  if (search) params.search = search;
  if (showArchived) params.showArchived = showArchived;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CONDITIONS_GET_LIST,
    apiFunc: () => MasterDataService.getConditions(params),
    onSuccess: function* (response) {
      const { data, meta } = response.data.data;
      yield put(setConditionsList(data));
      yield put(setTotalRecords(meta.total));
      yield put(setTotalPages(meta.totalPages));
    },
  });
}

function* createConditionSaga(action) {
  const { data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CONDITIONS_POST_CREATE,
    apiFunc: () => MasterDataService.createCondition(data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.conditionCreatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseDrawer());
      yield put(setRefreshConditions());
    },
  });
}

function* updateConditionSaga(action) {
  const { id, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CONDITIONS_PATCH_UPDATE,
    apiFunc: () => MasterDataService.updateCondition(id, data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.conditionUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseDrawer());
      yield put(setRefreshConditions());
    },
  });
}

function* toggleFavoriteSaga(action) {
  const { id } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CONDITIONS_PATCH_FAVORITE,
    apiFunc: () => MasterDataService.toggleConditionFavorite(id),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.conditionFavoriteToggled,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshConditions());
    },
  });
}

function* archiveConditionSaga(action) {
  const { id, isArchived } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CONDITIONS_PATCH_ARCHIVE,
    apiFunc: () =>
      isArchived
        ? MasterDataService.unarchiveCondition(id)
        : MasterDataService.archiveCondition(id),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: isArchived
            ? toastMessages.conditionUnarchivedSuccess
            : toastMessages.conditionArchivedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshConditions());
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(conditionsActions.fetchConditions().type, fetchConditionsSaga),
    takeLatest(conditionsActions.createCondition().type, createConditionSaga),
    takeLatest(conditionsActions.updateCondition().type, updateConditionSaga),
    takeLatest(conditionsActions.toggleFavorite().type, toggleFavoriteSaga),
    takeLatest(conditionsActions.archiveCondition().type, archiveConditionSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
