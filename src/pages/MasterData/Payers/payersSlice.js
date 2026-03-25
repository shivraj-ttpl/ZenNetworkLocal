import store from '@/core/store/store';
import { COMPONENT_KEYS } from '@/constants/componentKeys';

export const componentKey = COMPONENT_KEYS.PAYERS;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setPayersList: (state, action) => {
      state.payersList = action.payload;
    },
    setTotalRecords: (state, action) => {
      state.totalRecords = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.page = 1;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1;
    },
    setShowArchived: (state, action) => {
      state.showArchived = action.payload;
      state.page = 1;
    },
    setPayerType: (state, action) => {
      state.payerType = action.payload;
      state.page = 1;
    },
    setRefreshPayers: (state) => {
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
    },
    setOpenImportModal: (state) => {
      state.importModalOpen = true;
    },
    setCloseImportModal: (state) => {
      state.importModalOpen = false;
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
    payersList: [],
    totalRecords: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
    search: '',
    showArchived: false,
    payerType: null,
    refreshFlag: 0,
    drawerOpen: false,
    drawerMode: '',
    editData: null,
    importModalOpen: false,
    statusModalOpen: false,
    statusChangeRow: null,
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const {
  setPayersList,
  setTotalRecords,
  setTotalPages,
  setPage,
  setLimit,
  setSearch,
  setShowArchived,
  setPayerType,
  setRefreshPayers,
  setOpenAddDrawer,
  setOpenEditDrawer,
  setCloseDrawer,
  setOpenImportModal,
  setCloseImportModal,
  setOpenStatusModal,
  setCloseStatusModal,
} = slice.actions;
