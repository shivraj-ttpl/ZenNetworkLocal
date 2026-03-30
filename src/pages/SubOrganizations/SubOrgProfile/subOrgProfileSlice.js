import store from '@/core/store/store';
import { COMPONENT_KEYS } from '@/constants/componentKeys';

export const componentKey = COMPONENT_KEYS.SUB_ORG_PROFILE;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setRefreshProfile: (state) => {
      state.refreshFlag = Date.now();
    },
    setOpenEditDrawer: (state, action) => {
      state.drawerOpen = true;
      state.editData = action.payload;
    },
    setCloseDrawer: (state) => {
      state.drawerOpen = false;
      state.editData = null;
    },
  },
  initialReducerState: {
    profile: null,
    refreshFlag: 0,
    drawerOpen: false,
    editData: null,
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const { setProfile, setRefreshProfile, setOpenEditDrawer, setCloseDrawer } =
  slice.actions;
