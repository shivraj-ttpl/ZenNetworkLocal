import store from '@/core/store/store';
import { COMPONENT_KEYS } from '@/constants/componentKeys';

export const componentKey = COMPONENT_KEYS.EDUCATION;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setEducationList: (state, action) => {
      state.educationList = action.payload;
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
    setFilterSpecialty: (state, action) => {
      state.filterSpecialty = action.payload;
      state.page = 1;
    },
    setFilterFileType: (state, action) => {
      state.filterFileType = action.payload;
      state.page = 1;
    },
    setRefreshEducation: (state) => {
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
    setOpenViewModal: (state, action) => {
      state.viewModalOpen = true;
      state.viewData = action.payload;
    },
    setCloseViewModal: (state) => {
      state.viewModalOpen = false;
      state.viewData = null;
    },
  },
  initialReducerState: {
    educationList: [],
    totalRecords: 0,
    totalPages: 0,
    page: 1,
    limit: 20,
    search: '',
    showArchived: false,
    filterSpecialty: null,
    filterFileType: null,
    refreshFlag: 0,
    drawerOpen: false,
    drawerMode: '',
    editData: null,
    viewModalOpen: false,
    viewData: null,
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const {
  setEducationList,
  setTotalRecords,
  setTotalPages,
  setPage,
  setLimit,
  setSearch,
  setShowArchived,
  setFilterSpecialty,
  setFilterFileType,
  setRefreshEducation,
  setOpenAddDrawer,
  setOpenEditDrawer,
  setCloseDrawer,
  setOpenViewModal,
  setCloseViewModal,
} = slice.actions;
