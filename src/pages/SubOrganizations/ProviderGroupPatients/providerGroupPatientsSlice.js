import { COMPONENT_KEYS } from '@/constants/componentKeys';
import store from '@/core/store/store';

export const componentKey = COMPONENT_KEYS.PROVIDER_GROUP_PATIENTS;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setPatientList: (state, action) => {
      state.patientList = action.payload ?? [];
    },
    setTotalRecords: (state, action) => {
      state.totalRecords = action.payload ?? 0;
    },
    setRefreshPatients: (state) => {
      state.refreshFlag = Date.now();
    },
    setPatientDetail: (state, action) => {
      state.patientDetail = action.payload ?? null;
    },
    setOpenEditDrawer: (state, action) => {
      state.drawerOpen = true;
      state.editData = action.payload ?? null;
    },
    setCloseDrawer: (state) => {
      state.drawerOpen = false;
      state.editData = null;
      state.patientDetail = null;
    },
    setOpenUploadModal: (state) => {
      state.uploadModalOpen = true;
    },
    setCloseUploadModal: (state) => {
      state.uploadModalOpen = false;
      state.importResult = null;
    },
    setImportResult: (state, action) => {
      state.importResult = action.payload ?? null;
    },
    setOpenInactiveModal: (state, action) => {
      state.inactiveModalOpen = true;
      state.inactivePatient = action.payload ?? null;
    },
    setCloseInactiveModal: (state) => {
      state.inactiveModalOpen = false;
      state.inactivePatient = null;
    },
  },
  initialReducerState: {
    patientList: [],
    totalRecords: 0,
    refreshFlag: 0,
    patientDetail: null,
    drawerOpen: false,
    editData: null,
    uploadModalOpen: false,
    importResult: null,
    inactiveModalOpen: false,
    inactivePatient: null,
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const {
  setPatientList,
  setTotalRecords,
  setRefreshPatients,
  setPatientDetail,
  setOpenEditDrawer,
  setCloseDrawer,
  setOpenUploadModal,
  setCloseUploadModal,
  setImportResult,
  setOpenInactiveModal,
  setCloseInactiveModal,
} = slice.actions;
