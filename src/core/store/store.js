import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import loadingReducer from './loadingSlice';
import notificationReducer from './notificationSlice';
import { createReducerManager } from './reducerManager';
import { createSagaManager } from './sagaManager';

// Static reducers — always present
const staticReducers = {
  loading: loadingReducer,
  notification: notificationReducer,
};

// 1. Create reducer manager with static reducers pre-loaded
const reducerManager = createReducerManager(staticReducers);

// 2. Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// 3. Configure store
const store = configureStore({
  reducer: (state, action) => reducerManager.reduce(state, action),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(sagaMiddleware),
  devTools: import.meta.env.DEV,
});

// 4. Create saga manager
const sagaManager = createSagaManager(sagaMiddleware);

// 5. Attach managers to store for global access (like sozen pattern)
store.reducerManager = reducerManager;
store.sagaManager = sagaManager;

export default store;
