import { COMPONENT_KEYS } from '@/constants/componentKeys';
import store from '@/core/store/store';

export const componentKey = COMPONENT_KEYS.CODES;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setCodesList: (state, action) => {
      state.codesList = action.payload;
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
    setRefreshCodes: (state) => {
      state.refreshFlag = Date.now();
    },
    resetCodesListState: (state) => {
      state.codesList = [];
      state.totalRecords = 0;
      state.totalPages = 0;
      state.page = 1;
    },
    setDrawerOpenFrom: (state, action) => {
      state.drawerOpenFrom = action.payload;
    },
    setDrawerMode: (state, action) => {
      state.drawerMode = action.payload;
    },
    setEditData: (state, action) => {
      state.editData = action.payload;
    },
    setOpenAddDrawer: (state, action) => {
      state.drawerOpenFrom = action.payload;
      state.drawerMode = 'add';
      state.editData = null;
    },
    setOpenEditDrawer: (state, action) => {
      const { codeLabel, data } = action.payload;
      state.drawerOpenFrom = codeLabel;
      state.drawerMode = 'edit';
      state.editData = data;
    },
    closeDrawer: (state) => {
      state.drawerOpenFrom = '';
      state.drawerMode = '';
      state.editData = null;
    },
    openImportModal: (state, action) => {
      state.importModalFor = action.payload;
    },
    closeImportModal: (state) => {
      state.importModalFor = '';
    },
  },
  initialReducerState: {
    codesList: [],
    totalRecords: 0,
    totalPages: 0,
    page: 1,
    limit: 20,
    search: '',
    showArchived: false,
    refreshFlag: 0,
    drawerOpenFrom: '',
    drawerMode: '',
    editData: null,
    importModalFor: '',
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const {
  setCodesList,
  setTotalRecords,
  setTotalPages,
  setPage,
  setLimit,
  setSearch,
  setShowArchived,
  setRefreshCodes,
  resetCodesListState,
  setDrawerOpenFrom,
  setDrawerMode,
  setEditData,
  setOpenAddDrawer,
  setOpenEditDrawer,
  closeDrawer,
  openImportModal,
  closeImportModal,
} = slice.actions;
