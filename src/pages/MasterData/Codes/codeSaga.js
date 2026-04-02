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
import { downloadBlobFile } from '@/utils/GeneralUtils';

import {
  closeDrawer,
  closeImportModal,
  componentKey,
  setCodesList,
  setImportSuccess,
  setRefreshCodes,
  setTotalPages,
  setTotalRecords,
} from './codesSlice';

export const codesActions = createSagaActions(componentKey, [
  'fetchCodes',
  'createCode',
  'updateCode',
  'toggleFavorite',
  'archiveCode',
  'downloadTemplate',
  'importCodes',
  'fetchStandalone',
  'createStandalone',
  'updateStandalone',
  'toggleStandaloneFavorite',
  'archiveStandalone',
  'importStandalone',
]);

function* fetchCodesSaga(action) {
  const { type } = action.payload;
  const state = yield select((s) => s[componentKey]);
  const { page, limit, search, showArchived, sortKey, sortOrder } = state;

  const params = { page, limit };
  if (search) params.search = search;
  if (showArchived) params.showArchived = showArchived;
  if (sortKey) params.sortBy = sortKey;
  if (sortOrder) params.sortOrder = sortOrder;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CODES_GET_LIST,
    apiFunc: () => MasterDataService.getCodes(type, params),
    onSuccess: function* (response) {
      const { data, meta } = response.data.data;
      yield put(setCodesList(data));
      yield put(setTotalRecords(meta.total));
      yield put(setTotalPages(meta.totalPages));
    },
  });
}

function* createCodeSaga(action) {
  const { type, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CODES_POST_CREATE,
    apiFunc: () => MasterDataService.createCode(type, data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.codeCreatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(closeDrawer());
      yield put(setRefreshCodes());
    },
  });
}

function* updateCodeSaga(action) {
  const { type, id, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CODES_PATCH_UPDATE,
    apiFunc: () => MasterDataService.updateCode(type, id, data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.codeUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(closeDrawer());
      yield put(setRefreshCodes());
    },
  });
}

function* toggleFavoriteSaga(action) {
  const { type, id } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CODES_PATCH_FAVORITE,
    apiFunc: () => MasterDataService.toggleFavorite(type, id),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.codeFavoriteToggled,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshCodes());
    },
  });
}

function* archiveCodeSaga(action) {
  const { type, id, isArchived } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CODES_PATCH_ARCHIVE,
    apiFunc: () =>
      MasterDataService.archiveCode(type, id, { isArchived: !isArchived }),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: isArchived
            ? toastMessages.codeUnarchivedSuccess
            : toastMessages.codeArchivedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshCodes());
    },
  });
}

function* downloadTemplateSaga(action) {
  const { type } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.CODES_GET_TEMPLATE,
    apiFunc: () => MasterDataService.downloadTemplate(type),
    // eslint-disable-next-line require-yield
    onSuccess: function* (response) {
      downloadBlobFile(response.data, `${type}-codes-template.csv`, 'text/csv');
    },
  });
}

function* importCodesSaga(action) {
  const { type, file } = action.payload;
  const formData = new FormData();
  formData.append('file', file);

  yield* apiCall({
    loadingKey: LOADING_KEYS.CODES_POST_IMPORT,
    apiFunc: () => MasterDataService.importCodes(type, formData),
    onSuccess: function* () {
      yield put(closeImportModal());
      yield put(setImportSuccess(true));
      yield put(setRefreshCodes());
    },
  });
}

// ─── Standalone type helpers ────────────────────────────────────────────────

function getStandaloneListKey(type) {
  if (type === 'allergies') return LOADING_KEYS.ALLERGIES_GET_LIST;
  if (type === 'symptoms') return LOADING_KEYS.SYMPTOMS_GET_LIST;
  return LOADING_KEYS.MEDICATIONS_GET_LIST;
}

function getStandaloneCreateKey(type) {
  if (type === 'allergies') return LOADING_KEYS.ALLERGIES_POST_CREATE;
  if (type === 'symptoms') return LOADING_KEYS.SYMPTOMS_POST_CREATE;
  return LOADING_KEYS.MEDICATIONS_POST_CREATE;
}

function getStandaloneUpdateKey(type) {
  if (type === 'allergies') return LOADING_KEYS.ALLERGIES_PATCH_UPDATE;
  if (type === 'symptoms') return LOADING_KEYS.SYMPTOMS_PATCH_UPDATE;
  return LOADING_KEYS.MEDICATIONS_PATCH_UPDATE;
}

function getStandaloneFavoriteKey(type) {
  if (type === 'allergies') return LOADING_KEYS.ALLERGIES_PATCH_FAVORITE;
  if (type === 'symptoms') return LOADING_KEYS.SYMPTOMS_PATCH_FAVORITE;
  return LOADING_KEYS.MEDICATIONS_PATCH_FAVORITE;
}

function getStandaloneArchiveKey(type) {
  if (type === 'allergies') return LOADING_KEYS.ALLERGIES_PATCH_ARCHIVE;
  if (type === 'symptoms') return LOADING_KEYS.SYMPTOMS_PATCH_ARCHIVE;
  return LOADING_KEYS.MEDICATIONS_PATCH_ARCHIVE;
}

function getStandaloneApiFunc(type, params) {
  if (type === 'allergies') return MasterDataService.getAllergies(params);
  if (type === 'symptoms') return MasterDataService.getSymptoms(params);
  return MasterDataService.getMedications(params);
}

function getStandaloneCreateFunc(type, data) {
  if (type === 'allergies') return MasterDataService.createAllergy(data);
  if (type === 'symptoms') return MasterDataService.createSymptom(data);
  return MasterDataService.createMedication(data);
}

function getStandaloneUpdateFunc(type, id, data) {
  if (type === 'allergies') return MasterDataService.updateAllergy(id, data);
  if (type === 'symptoms') return MasterDataService.updateSymptom(id, data);
  return MasterDataService.updateMedication(id, data);
}

function getStandaloneFavoriteFunc(type, id) {
  if (type === 'allergies') return MasterDataService.toggleAllergyFavorite(id);
  if (type === 'symptoms') return MasterDataService.toggleSymptomFavorite(id);
  return MasterDataService.toggleMedicationFavorite(id);
}

function getStandaloneArchiveFunc(type, id, data) {
  if (type === 'allergies') return MasterDataService.archiveAllergy(id, data);
  if (type === 'symptoms') return MasterDataService.archiveSymptom(id, data);
  return MasterDataService.archiveMedication(id, data);
}

function getStandaloneCreateToast(type) {
  if (type === 'allergies') return toastMessages.allergyCreatedSuccess;
  if (type === 'symptoms') return toastMessages.symptomCreatedSuccess;
  return toastMessages.medicationCreatedSuccess;
}

function getStandaloneUpdateToast(type) {
  if (type === 'allergies') return toastMessages.allergyUpdatedSuccess;
  if (type === 'symptoms') return toastMessages.symptomUpdatedSuccess;
  return toastMessages.medicationUpdatedSuccess;
}

function getStandaloneFavoriteToast(type) {
  if (type === 'allergies') return toastMessages.allergyFavoriteToggled;
  if (type === 'symptoms') return toastMessages.symptomFavoriteToggled;
  return toastMessages.medicationFavoriteToggled;
}

function getStandaloneArchiveToast(type, isArchived) {
  if (type === 'allergies')
    return isArchived
      ? toastMessages.allergyUnarchivedSuccess
      : toastMessages.allergyArchivedSuccess;
  if (type === 'symptoms')
    return isArchived
      ? toastMessages.symptomUnarchivedSuccess
      : toastMessages.symptomArchivedSuccess;
  return isArchived
    ? toastMessages.medicationUnarchivedSuccess
    : toastMessages.medicationArchivedSuccess;
}

function getStandaloneImportKey(type) {
  if (type === 'allergies') return LOADING_KEYS.ALLERGIES_POST_IMPORT;
  if (type === 'symptoms') return LOADING_KEYS.SYMPTOMS_POST_IMPORT;
  return LOADING_KEYS.MEDICATIONS_POST_IMPORT;
}

function getStandaloneImportFunc(type, formData) {
  if (type === 'allergies') return MasterDataService.importAllergies(formData);
  if (type === 'symptoms') return MasterDataService.importSymptoms(formData);
  return MasterDataService.importMedications(formData);
}

// ─── Standalone sagas ───────────────────────────────────────────────────────

function* fetchStandaloneSaga(action) {
  const { type } = action.payload;
  const state = yield select((s) => s[componentKey]);
  const { page, limit, search, showArchived } = state;

  const params = { page, limit };
  if (search) params.search = search;
  if (showArchived) params.showArchived = showArchived;

  yield* apiCall({
    loadingKey: getStandaloneListKey(type),
    apiFunc: () => getStandaloneApiFunc(type, params),
    onSuccess: function* (response) {
      const { data, meta } = response.data.data;
      yield put(setCodesList(data));
      yield put(setTotalRecords(meta.total));
      yield put(setTotalPages(meta.totalPages));
    },
  });
}

function* createStandaloneSaga(action) {
  const { type, data } = action.payload;

  yield* apiCall({
    loadingKey: getStandaloneCreateKey(type),
    apiFunc: () => getStandaloneCreateFunc(type, data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: getStandaloneCreateToast(type),
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(closeDrawer());
      yield put(setRefreshCodes());
    },
  });
}

function* updateStandaloneSaga(action) {
  const { type, id, data } = action.payload;

  yield* apiCall({
    loadingKey: getStandaloneUpdateKey(type),
    apiFunc: () => getStandaloneUpdateFunc(type, id, data),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: getStandaloneUpdateToast(type),
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(closeDrawer());
      yield put(setRefreshCodes());
    },
  });
}

function* toggleStandaloneFavoriteSaga(action) {
  const { type, id } = action.payload;

  yield* apiCall({
    loadingKey: getStandaloneFavoriteKey(type),
    apiFunc: () => getStandaloneFavoriteFunc(type, id),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: getStandaloneFavoriteToast(type),
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshCodes());
    },
  });
}

function* archiveStandaloneSaga(action) {
  const { type, id, isArchived } = action.payload;

  yield* apiCall({
    loadingKey: getStandaloneArchiveKey(type),
    apiFunc: () => getStandaloneArchiveFunc(type, id, { isArchived }),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: getStandaloneArchiveToast(type, isArchived),
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshCodes());
    },
  });
}

function* importStandaloneSaga(action) {
  const { type, file } = action.payload;
  const formData = new FormData();
  formData.append('file', file);

  yield* apiCall({
    loadingKey: getStandaloneImportKey(type),
    apiFunc: () => getStandaloneImportFunc(type, formData),
    onSuccess: function* () {
      yield put(closeImportModal());
      yield put(setImportSuccess(true));
      yield put(setRefreshCodes());
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(codesActions.fetchCodes().type, fetchCodesSaga),
    takeLatest(codesActions.createCode().type, createCodeSaga),
    takeLatest(codesActions.updateCode().type, updateCodeSaga),
    takeLatest(codesActions.toggleFavorite().type, toggleFavoriteSaga),
    takeLatest(codesActions.archiveCode().type, archiveCodeSaga),
    takeLatest(codesActions.downloadTemplate().type, downloadTemplateSaga),
    takeLatest(codesActions.importCodes().type, importCodesSaga),
    takeLatest(codesActions.fetchStandalone().type, fetchStandaloneSaga),
    takeLatest(codesActions.createStandalone().type, createStandaloneSaga),
    takeLatest(codesActions.updateStandalone().type, updateStandaloneSaga),
    takeLatest(
      codesActions.toggleStandaloneFavorite().type,
      toggleStandaloneFavoriteSaga,
    ),
    takeLatest(codesActions.archiveStandalone().type, archiveStandaloneSaga),
    takeLatest(codesActions.importStandalone().type, importStandaloneSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
