import store from '@/core/store/store';
import { COMPONENT_KEYS } from '@/constants/componentKeys';

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
  },
  initialReducerState: {
    feeScheduleList: [],
    totalRecords: 0,
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
  setFeeScheduleList,
  setTotalRecords,
  setRefreshFeeSchedule,
  setOpenAddDrawer,
  setOpenEditDrawer,
  setCloseDrawer,
} = slice.actions;
