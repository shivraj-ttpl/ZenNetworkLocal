import { createSlice } from '@reduxjs/toolkit';

let notificationCounter = 0;

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    list: [], // [{ id, message, variant }]
  },
  reducers: {
    addNotification(state, action) {
      notificationCounter += 1;
      state.list.push({
        id: `toast-${Date.now()}-${notificationCounter}`,
        ...action.payload,
      });
    },
    removeNotification(state, action) {
      state.list = state.list.filter((n) => n.id !== action.payload);
    },
    clearNotifications(state) {
      state.list = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;

export const TOASTER_VARIANT = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};
