import store from '@/core/store/store';
import { COMPONENT_KEYS } from '@/constants/componentKeys';

export const componentKey = COMPONENT_KEYS.CONDITIONS;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setConditionsList: (state, action) => {
      state.conditionsList = action.payload;
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
    setRefreshConditions: (state) => {
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
  },
  initialReducerState: {
    conditionsList: [],
    totalRecords: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
    search: '',
    showArchived: false,
    refreshFlag: 0,
    drawerOpen: false,
    drawerMode: '',
    editData: null,
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const {
  setConditionsList,
  setTotalRecords,
  setTotalPages,
  setPage,
  setLimit,
  setSearch,
  setShowArchived,
  setRefreshConditions,
  setOpenAddDrawer,
  setOpenEditDrawer,
  setCloseDrawer,
} = slice.actions;
