import { COMPONENT_KEYS } from '@/constants/componentKeys';
import store from '@/core/store/store';

export const componentKey = COMPONENT_KEYS.PROVIDER_GROUP_FEE_SCHEDULE;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setFeeScheduleList: (state, action) => {
      state.feeScheduleList = action.payload;
    },
    setTotalRecords: (state, action) => {
      state.totalRecords = action.payload;
    },
    setRefreshFeeSchedule: (state) => {
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
    setOpenDeleteModal: (state, action) => {
      state.deleteModal = { open: true, row: action.payload };
    },
    setCloseDeleteModal: (state) => {
      state.deleteModal = { open: false, row: null };
    },
  },
  initialReducerState: {
    feeScheduleList: [],
    totalRecords: 0,
    refreshFlag: 0,
    drawerOpen: false,
    drawerMode: '',
    editData: null,
    deleteModal: { open: false, row: null },
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const {
  setFeeScheduleList,
  setTotalRecords,
  setRefreshFeeSchedule,
  setOpenAddDrawer,
  setOpenEditDrawer,
  setCloseDrawer,
  setOpenDeleteModal,
  setCloseDeleteModal,
} = slice.actions;
