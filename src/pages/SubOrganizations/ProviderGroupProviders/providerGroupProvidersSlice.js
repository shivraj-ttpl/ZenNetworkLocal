import { COMPONENT_KEYS } from '@/constants/componentKeys';
import store from '@/core/store/store';

export const componentKey = COMPONENT_KEYS.PROVIDER_GROUP_PROVIDERS;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setProvidersList: (state, action) => {
      state.providersList = action.payload;
    },
    setTotalRecords: (state, action) => {
      state.totalRecords = action.payload;
    },
    setProviderDetail: (state, action) => {
      state.providerDetail = action.payload;
    },
    setRefreshProviders: (state) => {
      state.refreshFlag = Date.now();
    },
    setOpenAddDrawer: (state) => {
      state.drawerOpen = true;
      state.drawerMode = 'add';
      state.editData = null;
    },
    setOpenEditDrawer: (state, action) => {
      state.drawerOpen = true;
      state.drawerMode = 'edit';
      state.editData = action.payload;
    },
    setCloseDrawer: (state) => {
      state.drawerOpen = false;
      state.drawerMode = '';
      state.editData = null;
      state.providerDetail = null;
    },
    setOpenViewModal: (state, action) => {
      state.viewModalOpen = true;
      state.viewData = action.payload;
    },
    setCloseViewModal: (state) => {
      state.viewModalOpen = false;
      state.viewData = null;
      state.providerDetail = null;
    },
    setOpenStatusModal: (state, action) => {
      state.statusModalOpen = true;
      state.statusChangeRow = action.payload;
    },
    setCloseStatusModal: (state) => {
      state.statusModalOpen = false;
      state.statusChangeRow = null;
    },
  },
  initialReducerState: {
    providersList: [],
    totalRecords: 0,
    refreshFlag: 0,
    providerDetail: null,
    drawerOpen: false,
    drawerMode: '',
    editData: null,
    viewModalOpen: false,
    viewData: null,
    statusModalOpen: false,
    statusChangeRow: null,
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const {
  setProvidersList,
  setTotalRecords,
  setProviderDetail,
  setRefreshProviders,
  setOpenAddDrawer,
  setOpenEditDrawer,
  setCloseDrawer,
  setOpenViewModal,
  setCloseViewModal,
  setOpenStatusModal,
  setCloseStatusModal,
} = slice.actions;
