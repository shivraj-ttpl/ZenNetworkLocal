import store from "@/core/store/store";
import { COMPONENT_KEYS } from "@/constants/componentKeys";

export const componentKey = COMPONENT_KEYS.DASHBOARD;

const { actions } = store.reducerManager.add({
  key: componentKey,
  addedReducers: {
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    setChartData: (state, action) => {
      state.chartData = action.payload;
    },
  },
  initialReducerState: {
    stats: null,
    chartData: null,
  },
});

export const { setStats, setChartData } = actions;
