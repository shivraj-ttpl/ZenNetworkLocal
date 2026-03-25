import store from "@/core/store/store";
import { COMPONENT_KEYS } from "@/constants/componentKeys";

export const componentKey = COMPONENT_KEYS.PROVIDER_GROUP_PROVIDERS;

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
    setOpenViewModal: (state, action) => {
      state.viewModalOpen = true;
      state.viewData = action.payload;
    },
    setCloseViewModal: (state) => {
      state.viewModalOpen = false;
      state.viewData = null;
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
    viewModalOpen: false,
    viewData: null,
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
  setOpenViewModal,
  setCloseViewModal,
  setOpenStatusModal,
  setCloseStatusModal,
} = slice.actions;
