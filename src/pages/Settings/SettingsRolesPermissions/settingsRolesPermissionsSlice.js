import store from "@/core/store/store";
import { COMPONENT_KEYS } from "@/constants/componentKeys";

export const componentKey = COMPONENT_KEYS.SETTINGS_ROLES_PERMISSIONS;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setOpenCreateRoleModal: (state) => {
      state.createRoleModalOpen = true;
    },
    setCloseCreateRoleModal: (state) => {
      state.createRoleModalOpen = false;
    },
  },
  initialReducerState: {
    createRoleModalOpen: false,
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const {
  setOpenCreateRoleModal,
  setCloseCreateRoleModal,
} = slice.actions;
