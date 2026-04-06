import { COMPONENT_KEYS } from '@/constants/componentKeys';
import store from '@/core/store/store';

export const componentKey = COMPONENT_KEYS.PROVIDER_GROUP_USERS;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setUsersList: (state, action) => {
      state.usersList = action.payload;
    },
    setTotalRecords: (state, action) => {
      state.totalRecords = action.payload;
    },
    setRefreshUsers: (state) => {
      state.refreshFlag = Date.now();
    },
    setUserDetail: (state, action) => {
      state.userDetail = action.payload;
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
      state.userDetail = null;
    },
  },
  initialReducerState: {
    usersList: [],
    totalRecords: 0,
    refreshFlag: 0,
    userDetail: null,
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
  setUsersList,
  setTotalRecords,
  setRefreshUsers,
  setUserDetail,
  setOpenAddDrawer,
  setOpenEditDrawer,
  setCloseDrawer,
  setOpenViewModal,
  setCloseViewModal,
} = slice.actions;
