import { COMPONENT_KEYS } from '@/constants/componentKeys';
import store from '@/core/store/store';

export const componentKey = COMPONENT_KEYS.SETTING_USER_PROFILE;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setProfileData: (state, action) => {
      state.profileData = action.payload;
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
    profileData: null,
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
  setProfileData,
  setOpenAddDrawer,
  setOpenEditDrawer,
  setCloseDrawer,
} = slice.actions;
