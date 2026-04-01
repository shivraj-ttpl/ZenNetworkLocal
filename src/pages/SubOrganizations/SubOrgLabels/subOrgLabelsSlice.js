import store from '@/core/store/store';
import { COMPONENT_KEYS } from '@/constants/componentKeys';

export const componentKey = COMPONENT_KEYS.SUB_ORG_LABELS;

const sliceConfig = {
  key: componentKey,
  addedReducers: {
    setLabelsList: (state, action) => {
      state.labelsList = action.payload;
    },
  },
  initialReducerState: {
    labelsList: [],
  },
};

let slice = store.reducerManager.add(sliceConfig);

export function registerReducer() {
  slice = store.reducerManager.add(sliceConfig);
}

export const { setLabelsList } = slice.actions;
