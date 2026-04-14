import { COMPONENT_KEYS } from '@/constants/componentKeys';
import store from '@/core/store/store';

export const componentKey = COMPONENT_KEYS.PROVIDER_GROUP_CONFIGURATION;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setConfiguration: (state, action) => {
      state.configuration = action.payload;
    },
    setRefreshConfiguration: (state) => {
      state.refreshFlag = Date.now();
    },
  },
  initialReducerState: {
    configuration: null,
    refreshFlag: 0,
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const { setConfiguration, setRefreshConfiguration } = slice.actions;
