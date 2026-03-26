import store from "@/core/store/store";
import { COMPONENT_KEYS } from "@/constants/componentKeys";

export const componentKey = COMPONENT_KEYS.USER_PROFILE;

const sliceConfig = {
  key: componentKey,
  addedReducers: {

    setOpenEditDrawer: (state, action) => {
      state.drawerOpen = true;
      state.drawerMode = "edit";
      state.editData = action.payload;
    },
    setCloseDrawer: (state) => {
      state.drawerOpen = false;
      state.drawerMode = "";
      state.editData = null;
    },
  },
  initialReducerState: {
    drawerOpen: false,
    drawerMode: "",
    editData: null,
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const { setOpenAddDrawer, setOpenEditDrawer, setCloseDrawer } = slice.actions;
