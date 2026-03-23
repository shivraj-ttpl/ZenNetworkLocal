import store from "@/core/store/store";
import { COMPONENT_KEYS } from "@/constants/componentKeys";

export const componentKey = COMPONENT_KEYS.CODES;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setDrawerOpenFrom: (state, action) => {
      state.drawerOpenFrom = action.payload;
    },
    setDrawerMode: (state, action) => {
      state.drawerMode = action.payload;
    },
    setEditData: (state, action) => {
      state.editData = action.payload;
    },
    setOpenAddDrawer: (state, action) => {
      state.drawerOpenFrom = action.payload;
      state.drawerMode = "add";
      state.editData = null;
    },
    setOpenEditDrawer: (state, action) => {
      const { codeLabel, data } = action.payload;
      state.drawerOpenFrom = codeLabel;
      state.drawerMode = "edit";
      state.editData = data;
    },
    closeDrawer: (state) => {
      state.drawerOpenFrom = "";
      state.drawerMode = "";
      state.editData = null;
    },
  },
  initialReducerState: {
    drawerOpenFrom: "",
    drawerMode: "",
    editData: null,
  },
};

// Initial registration (module load)
let slice = store.reducerManager.add(sliceConfig);

// Re-register after cleanup removes the reducer
export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const { setDrawerOpenFrom, setDrawerMode, setEditData, setOpenAddDrawer, setOpenEditDrawer, closeDrawer } = slice.actions;
