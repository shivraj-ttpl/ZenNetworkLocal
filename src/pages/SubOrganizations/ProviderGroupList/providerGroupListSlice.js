import store from '@/core/store/store';
import { COMPONENT_KEYS } from '@/constants/componentKeys';

export const componentKey = COMPONENT_KEYS.PROVIDER_GROUP_LIST;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setProviderGroupList: (state, action) => {
      state.providerGroupList = action.payload;
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
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      state.page = 1;
    },
    setSortKey: (state, action) => {
      state.sortKey = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setRefreshList: (state) => {
      state.refreshFlag = Date.now();
    },
    setDrawerOpen: (state, action) => {
      state.drawerOpen = action.payload;
      state.drawerMode = 'add';
      state.editData = null;
    },
    setEditDrawer: (state, action) => {
      state.drawerOpen = true;
      state.drawerMode = 'edit';
      state.editData = action.payload;
    },
    setCloseDrawer: (state) => {
      state.drawerOpen = false;
      state.drawerMode = '';
      state.editData = null;
    },
    setStatusModal: (state, action) => {
      state.statusModal = action.payload;
    },
  },
  initialReducerState: {
    providerGroupList: [],
    totalRecords: 0,
    totalPages: 0,
    page: 1,
    limit: 20,
    search: '',
    showArchived: false,
    statusFilter: null,
    sortKey: null,
    sortOrder: null,
    refreshFlag: 0,
    drawerOpen: false,
    drawerMode: '',
    editData: null,
    statusModal: { open: false, row: null },
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const {
  setProviderGroupList,
  setTotalRecords,
  setTotalPages,
  setPage,
  setLimit,
  setSearch,
  setShowArchived,
  setStatusFilter,
  setSortKey,
  setSortOrder,
  setRefreshList,
  setDrawerOpen,
  setEditDrawer,
  setCloseDrawer,
  setStatusModal,
} = slice.actions;
