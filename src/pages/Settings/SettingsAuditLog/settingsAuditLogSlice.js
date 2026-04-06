import { COMPONENT_KEYS } from '@/constants/componentKeys';
import store from '@/core/store/store';

export const componentKey = COMPONENT_KEYS.SETTINGS_AUDIT_LOGS;

const EMPTY_FILTERS = { action: null, startDate: null, endDate: null };

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setAuditLogs: (state, action) => {
      state.auditLogs = action.payload.data ?? [];
      state.total = action.payload.meta?.total ?? 0;
      state.totalPages = action.payload.meta?.totalPages ?? 1;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = { ...EMPTY_FILTERS };
    },
  },
  initialReducerState: {
    auditLogs: [],
    total: 0,
    totalPages: 1,
    filters: { ...EMPTY_FILTERS },
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const { setAuditLogs, setFilters, clearFilters } = slice.actions;
