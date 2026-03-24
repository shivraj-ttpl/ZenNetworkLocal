import store from "@/core/store/store";
import { COMPONENT_KEYS } from "@/constants/componentKeys";

export const componentKey = COMPONENT_KEYS.PAYERS;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setOpenAddDrawer: (state) => {
      state.drawerOpen = true;
      state.drawerMode = "add";
      state.editData = null;
    },
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
    setOpenImportModal: (state) => {
      state.importModalOpen = true;
    },
    setCloseImportModal: (state) => {
      state.importModalOpen = false;
    },
    setOpenStatusModal: (state, action) => {
      state.statusModalOpen = true;
      state.statusChangeRow = action.payload;
    },
    setCloseStatusModal: (state) => {
      state.statusModalOpen = false;
      state.statusChangeRow = null;
    },
  },
  initialReducerState: {
    drawerOpen: false,
    drawerMode: "",
    editData: null,
    importModalOpen: false,
    statusModalOpen: false,
    statusChangeRow: null,
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const {
  setOpenAddDrawer,
  setOpenEditDrawer,
  setCloseDrawer,
  setOpenImportModal,
  setCloseImportModal,
  setOpenStatusModal,
  setCloseStatusModal,
} = slice.actions;
