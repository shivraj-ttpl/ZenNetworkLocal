import store from "@/core/store/store";
import { COMPONENT_KEYS } from "@/constants/componentKeys";

export const componentKey = COMPONENT_KEYS.SETTINGS_USERS;

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
    setOpenFilterDrawer: (state) => {
      state.filterDrawerOpen = true;
    },
    setCloseFilterDrawer: (state) => {
      state.filterDrawerOpen = false;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = { subOrganization: null, status: null };
    },
    setUsersData: (state, action) => {
      state.usersData = action.payload.data ?? action.payload ?? [];
      state.totalRecords = action.payload.totalRecords ?? action.payload?.length ?? 0;
    },
    setUserDetail: (state, action) => {
      const { data, mode } = action.payload;
      if (mode === 'edit') {
        state.drawerOpen = true;
        state.drawerMode = 'edit';
        state.editData = data;
      } else {
        state.viewModalOpen = true;
        state.viewData = data;
      }
    },
    updateUserStatusInList: (state, action) => {
      const { userId, status } = action.payload;
      const user = (state.usersData ?? []).find((u) => u.id === userId);
      if (user) user.status = status;
    },
    updateUserArchiveInList: (state, action) => {
      const { userId, isArchived } = action.payload;
      const user = (state.usersData ?? []).find((u) => u.id === userId);
      if (user) user.isArchived = isArchived;
    },
  },
  initialReducerState: {
    drawerOpen: false,
    drawerMode: "",
    editData: null,
    viewModalOpen: false,
    viewData: null,
    filterDrawerOpen: false,
    filters: { subOrganization: null, status: null },
    usersData: [],
    totalRecords: 0,
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
  setOpenFilterDrawer,
  setCloseFilterDrawer,
  setFilters,
  clearFilters,
  setUsersData,
  setUserDetail,
  updateUserStatusInList,
  updateUserArchiveInList,
} = slice.actions;
