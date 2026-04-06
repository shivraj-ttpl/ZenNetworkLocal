import { createSlice } from '@reduxjs/toolkit';

// Manages both a global loading flag and granular per-key loading states
const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    global: false, // single global flag (toggled by interceptors)
    keys: {}, // { [loadingKey]: true/false }
  },
  reducers: {
    setGlobalLoading(state, action) {
      state.global = action.payload;
    },
    setLoadingKey(state, action) {
      const { key, value } = action.payload;
      state.keys[key] = value;
    },
    clearLoadingKey(state, action) {
      delete state.keys[action.payload];
    },
    // Bulk clear all keys that belong to a component
    clearLoadingKeysByPrefix(state, action) {
      const prefix = action.payload;
      for (const key of Object.keys(state.keys)) {
        if (key.startsWith(prefix)) {
          delete state.keys[key];
        }
      }
    },
  },
});

export const {
  setGlobalLoading,
  setLoadingKey,
  clearLoadingKey,
  clearLoadingKeysByPrefix,
} = loadingSlice.actions;

export default loadingSlice.reducer;

// --- Selectors ---
export const selectGlobalLoading = (state) => state.loading.global;
export const selectLoadingByKey = (key) => (state) => !!state.loading.keys[key];
export const selectAnyLoadingByPrefix = (prefix) => (state) =>
  Object.keys(state.loading.keys).some(
    (k) => k.startsWith(prefix) && state.loading.keys[k],
  );
