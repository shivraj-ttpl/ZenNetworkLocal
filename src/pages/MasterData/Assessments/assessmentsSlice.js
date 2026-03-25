import store from "@/core/store/store";
import { COMPONENT_KEYS } from "@/constants/componentKeys";

export const componentKey = COMPONENT_KEYS.ASSESSMENTS;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
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
    drawerOpen: false,
    viewData: null,
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const { setOpenViewDrawer, setCloseDrawer } = slice.actions;
