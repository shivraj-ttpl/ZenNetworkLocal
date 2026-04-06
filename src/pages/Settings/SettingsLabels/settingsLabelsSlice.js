import { COMPONENT_KEYS } from '@/constants/componentKeys';
import store from '@/core/store/store';

export const componentKey = COMPONENT_KEYS.SETTINGS_LABELS;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setLabelsList: (state, action) => {
      state.labelsList = action.payload;
    },
    setRefreshLabels: (state) => {
      state.refreshFlag = Date.now();
    },
    setDefaultLabels: (state, action) => {
      state.defaultLabels = action.payload;
    },
  },
  initialReducerState: {
    labelsList: [],
    defaultLabels: null,
    refreshFlag: 0,
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const { setLabelsList, setRefreshLabels, setDefaultLabels } =
  slice.actions;
