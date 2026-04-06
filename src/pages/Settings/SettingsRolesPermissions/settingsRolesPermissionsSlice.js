import { COMPONENT_KEYS } from '@/constants/componentKeys';
import store from '@/core/store/store';

export const componentKey = COMPONENT_KEYS.SETTINGS_ROLES_PERMISSIONS;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setRolesData: (state, action) => {
      state.rolesData = action.payload.data ?? [];
      state.totalRecords = action.payload.meta?.total ?? 0;
    },
    setOpenCreateRoleModal: (state) => {
      state.createRoleModalOpen = true;
    },
    setCloseCreateRoleModal: (state) => {
      state.createRoleModalOpen = false;
    },
    setRoleDetail: (state, action) => {
      state.roleDetail = action.payload;
    },
    setRefreshRoles: (state) => {
      state.refreshFlag = Date.now();
    },
  },
  initialReducerState: {
    rolesData: [],
    totalRecords: 0,
    roleDetail: null,
    createRoleModalOpen: false,
    refreshFlag: 0,
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const {
  setRolesData,
  setRoleDetail,
  setOpenCreateRoleModal,
  setCloseCreateRoleModal,
  setRefreshRoles,
} = slice.actions;
