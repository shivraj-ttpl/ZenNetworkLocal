import { COMPONENT_KEYS } from '@/constants/componentKeys';
import store from '@/core/store/store';

export const componentKey = COMPONENT_KEYS.PROVIDER_GROUP_PROVIDER_AVAILABILITY;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setCalendarData: (state, action) => {
      state.calendarData = action.payload ?? [];
    },
    setDateSlotsData: (state, action) => {
      state.dateSlotsData = action.payload ?? null;
    },
    setRefreshCalendar: (state) => {
      state.refreshCalendarFlag = Date.now();
    },
    setOpenConfigureDrawer: (state, action) => {
      state.configureDrawerOpen = true;
      state.configureDate = action.payload ?? null;
    },
    setCloseConfigureDrawer: (state) => {
      state.configureDrawerOpen = false;
      state.configureDate = null;
    },
    setOpenBlockDayModal: (state, action) => {
      state.blockDayModalOpen = true;
      state.blockDayDate = action.payload ?? null;
    },
    setCloseBlockDayModal: (state) => {
      state.blockDayModalOpen = false;
      state.blockDayDate = null;
    },
    setOpenAvailableSlotsModal: (state, action) => {
      state.availableSlotsModalOpen = true;
      state.availableSlotsData = action.payload ?? null;
    },
    setCloseAvailableSlotsModal: (state) => {
      state.availableSlotsModalOpen = false;
      state.availableSlotsData = null;
    },
    setOpenConfigureDateDrawer: (state, action) => {
      state.configureDateDrawerOpen = true;
      state.configureDateValue = action.payload ?? null;
    },
    setCloseConfigureDateDrawer: (state) => {
      state.configureDateDrawerOpen = false;
      state.configureDateValue = null;
    },
  },
  initialReducerState: {
    calendarData: [],
    dateSlotsData: null,
    refreshCalendarFlag: 0,
    configureDrawerOpen: false,
    configureDate: null,
    blockDayModalOpen: false,
    blockDayDate: null,
    availableSlotsModalOpen: false,
    availableSlotsData: null,
    configureDateDrawerOpen: false,
    configureDateValue: null,
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const {
  setCalendarData,
  setDateSlotsData,
  setRefreshCalendar,
  setOpenConfigureDrawer,
  setCloseConfigureDrawer,
  setOpenBlockDayModal,
  setCloseBlockDayModal,
  setOpenAvailableSlotsModal,
  setCloseAvailableSlotsModal,
  setOpenConfigureDateDrawer,
  setCloseConfigureDateDrawer,
} = slice.actions;
