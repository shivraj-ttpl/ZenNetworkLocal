import store from "@/core/store/store";
import { COMPONENT_KEYS } from "@/constants/componentKeys";

export const componentKey = COMPONENT_KEYS.SUB_ORG_PROFILE;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
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
    drawerOpen: false,
    editData: null,
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const { setOpenEditDrawer, setCloseDrawer } = slice.actions;
