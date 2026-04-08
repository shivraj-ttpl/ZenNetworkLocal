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
  setCloseDrawer,
  setCloseInactiveModal,
  setCloseUploadModal,
  setImportResult,
  setPatientDetail,
  setPatientList,
  setRefreshPatients,
  setTotalRecords,
} from './providerGroupPatientsSlice';

export const patientActions = createSagaActions(componentKey, [
  'fetchPatients',
  'fetchPatientById',
  'updatePatient',
  'enrollPatient',
  'unenrollPatient',
  'inactivatePatient',
  'recoverPatient',
  'importPatientsCsv',
]);

function* fetchPatientsSaga(action) {
  const { providerGroupId, tenantName, ...params } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PG_PATIENTS_GET_LIST,
    apiFunc: () =>
      ProviderGroupDataService.getPatients(providerGroupId, tenantName, {
        ...params,
      }),
    onSuccess: function* (response) {
      const responseData = response.data?.data ?? response.data;
      const data = responseData?.data ?? responseData;
      const total = responseData?.meta?.total ?? data?.length ?? 0;
      yield put(setPatientList(Array.isArray(data) ? data : []));
      yield put(setTotalRecords(total));
    },
  });
}

function* fetchPatientByIdSaga(action) {
  const { id, providerGroupId, tenantName } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PG_PATIENTS_GET_BY_ID,
    apiFunc: () =>
      ProviderGroupDataService.getPatientById(id, providerGroupId, tenantName),
    onSuccess: function* (response) {
      const detail = response.data?.data ?? response.data;
      yield put(setPatientDetail(detail));
    },
  });
}

function* updatePatientSaga(action) {
  const { id, providerGroupId, tenantName, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PG_PATIENTS_PATCH_UPDATE,
    apiFunc: () =>
      ProviderGroupDataService.updatePatient(
        id,
        providerGroupId,
        tenantName,
        data,
      ),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.patientUpdatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseDrawer());
      yield put(setRefreshPatients());
    },
  });
}

function* enrollPatientSaga(action) {
  const { id, providerGroupId, tenantName, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PG_PATIENTS_POST_ENROLL,
    apiFunc: () =>
      ProviderGroupDataService.enrollPatient(
        id,
        providerGroupId,
        tenantName,
        data,
      ),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.patientEnrolledSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshPatients());
    },
  });
}

function* unenrollPatientSaga(action) {
  const { id, providerGroupId, tenantName } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PG_PATIENTS_POST_UNENROLL,
    apiFunc: () =>
      ProviderGroupDataService.unenrollPatient(id, providerGroupId, tenantName),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.patientUnenrolledSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshPatients());
    },
  });
}

function* inactivatePatientSaga(action) {
  const { id, providerGroupId, tenantName, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PG_PATIENTS_POST_INACTIVE,
    apiFunc: () =>
      ProviderGroupDataService.inactivatePatient(
        id,
        providerGroupId,
        tenantName,
        data,
      ),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.patientInactivatedSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseInactiveModal());
      yield put(setRefreshPatients());
    },
  });
}

function* recoverPatientSaga(action) {
  const { id, providerGroupId, tenantName, data } = action.payload;

  yield* apiCall({
    loadingKey: LOADING_KEYS.PG_PATIENTS_POST_RECOVER,
    apiFunc: () =>
      ProviderGroupDataService.recoverPatient(
        id,
        providerGroupId,
        tenantName,
        data,
      ),
    onSuccess: function* () {
      yield put(
        addNotification({
          message: toastMessages.patientRecoveredSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setRefreshPatients());
    },
  });
}

function* importPatientsCsvSaga(action) {
  const { providerGroupId, tenantName, file } = action.payload;
  const formData = new FormData();
  formData.append('file', file);

  yield* apiCall({
    loadingKey: LOADING_KEYS.PG_PATIENTS_POST_IMPORT_CSV,
    apiFunc: () =>
      ProviderGroupDataService.importPatientsCsv(
        providerGroupId,
        tenantName,
        formData,
      ),
    onSuccess: function* (response) {
      const result = response.data?.data ?? response.data;
      yield put(setImportResult(result));
      yield put(
        addNotification({
          message: toastMessages.patientCsvImportSuccess,
          variant: TOASTER_VARIANT.SUCCESS,
        }),
      );
      yield put(setCloseUploadModal());
      yield put(setRefreshPatients());
    },
  });
}

function* rootSaga() {
  yield all([
    takeLatest(patientActions.fetchPatients().type, fetchPatientsSaga),
    takeLatest(patientActions.fetchPatientById().type, fetchPatientByIdSaga),
    takeLatest(patientActions.updatePatient().type, updatePatientSaga),
    takeLatest(patientActions.enrollPatient().type, enrollPatientSaga),
    takeLatest(patientActions.unenrollPatient().type, unenrollPatientSaga),
    takeLatest(patientActions.inactivatePatient().type, inactivatePatientSaga),
    takeLatest(patientActions.recoverPatient().type, recoverPatientSaga),
    takeLatest(patientActions.importPatientsCsv().type, importPatientsCsvSaga),
  ]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
