import store from '@/core/store/store';
import { COMPONENT_KEYS } from '@/constants/componentKeys';

export const componentKey = COMPONENT_KEYS.ASSESSMENTS;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setAssessmentsList: (state, action) => {
      state.assessmentsList = action.payload;
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
    setRefreshAssessments: (state) => {
      state.refreshFlag = Date.now();
    },
    setOpenViewDrawer: (state, action) => {
      state.drawerOpen = true;
      state.viewData = action.payload;
    },
    setCloseDrawer: (state) => {
      state.drawerOpen = false;
      state.viewData = null;
    },
  },
  initialReducerState: {
    assessmentsList: [],
    totalRecords: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
    search: '',
    showArchived: false,
    refreshFlag: 0,
    drawerOpen: false,
    viewData: null,
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const {
  setAssessmentsList,
  setTotalRecords,
  setTotalPages,
  setPage,
  setLimit,
  setSearch,
  setShowArchived,
  setRefreshAssessments,
  setOpenViewDrawer,
  setCloseDrawer,
} = slice.actions;
