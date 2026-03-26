import store from "@/core/store/store";
import { COMPONENT_KEYS } from "@/constants/componentKeys";

export const componentKey = COMPONENT_KEYS.PROVIDER_GROUP_PATIENTS;

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
    setOpenUploadModal: (state) => {
      state.uploadModalOpen = true;
    },
    setCloseUploadModal: (state) => {
      state.uploadModalOpen = false;
    },
  },
  initialReducerState: {
    drawerOpen: false,
    editData: null,
    uploadModalOpen: false,
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const {
  setOpenEditDrawer,
  setCloseDrawer,
  setOpenUploadModal,
  setCloseUploadModal,
} = slice.actions;
