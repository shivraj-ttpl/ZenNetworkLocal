import { createSlice, combineReducers } from "@reduxjs/toolkit";

export function createReducerManager(initialReducers = {}) {
  const reducers = { ...initialReducers };
  let combinedReducer = combineReducers(reducers);
  let keysToRemove = [];

  const manager = {
    getReducerMap: () => reducers,

    // Dynamically add a slice — called from any page/feature slice file
    // Usage: store.reducerManager.add({ key, addedReducers, initialReducerState })
    add({ key, addedReducers, initialReducerState }) {
      if (!key || reducers[key]) {
        // Already registered — return existing actions
        if (reducers[key]) {
          const slice = createSlice({
            name: key,
            initialState: initialReducerState,
            reducers: addedReducers,
          });
          return slice;
        }
        return null;
      }

      const slice = createSlice({
        name: key,
        initialState: initialReducerState,
        reducers: addedReducers,
      });

      reducers[key] = slice.reducer;
      combinedReducer = combineReducers(reducers);

      return slice;
    },

    remove(key) {
      if (!key || !reducers[key]) return;
      delete reducers[key];
      keysToRemove.push(key);
      combinedReducer = combineReducers(reducers);
    },

    reduce(state, action) {
      if (keysToRemove.length > 0) {
        state = { ...state };
        for (const key of keysToRemove) {
          delete state[key];
        }
        keysToRemove = [];
      }
      return combinedReducer(state, action);
    },
  };

  return manager;
}
